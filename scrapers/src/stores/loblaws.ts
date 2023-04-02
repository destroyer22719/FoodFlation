import puppeteer from "puppeteer";
import sequelize from "../../src/db.js";
import { v4 as uuidv4 } from "uuid";
import cliProgress from "cli-progress";
import ora from "ora";
import colors from "ansi-colors";
import fs from "fs";
import path from "path";
import Price from "../../../backend/src/model/Price.js";
import Item from "../../../backend/src/model/Item.js";
import Store from "../../../backend/src/model/Store.js";
import Company from "../../../backend/src/model/Company.js";
import { Address, StoreIndexes } from "../../src/global.js";
import { defaultItems, msToTime } from "../util.js";

const __dirname = path.resolve();

export async function getPricesLoblaws(
  stores: Address[],
  items: string[],
  storeIndexes: StoreIndexes,
  storeStart: number = 0
) {
  if (stores.length === 0) {
    return;
  }

  const startTime = Date.now();

  await sequelize.sync();
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.loblaws.ca/store-locator?", [
    "geolocation",
  ]);

  const multiBar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  );

  const storeBar = multiBar.create(
    stores.length + storeStart,
    storeStart,
    {},
    {
      format:
        "Loblaws |" +
        colors.cyan("{bar}") +
        "| {percentage}% | {value}/{total} Stores",
      hideCursor: true,
    }
  );

  const itemBar = multiBar.create(
    defaultItems.length,
    items.length !== defaultItems.length
      ? defaultItems.length - items.length
      : 0,
    {},
    {
      format:
        "Items   |" +
        colors.magenta("{bar}") +
        "| {percentage}% | {value}/{total} Items",
      hideCursor: true,
    }
  );

  //this is a cheap workaround for combining multiple bars with ora spinners
  multiBar.create(0, 0);

  const loader = ora("Scraping Loblaws...").start();

  const item2category = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "config", "item2category.json"),
      "utf-8"
    )
  );

  let popupDeleted = false;

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, postalCode, province, country, street } = store;

    postalCode = postalCode as string;
    province = province as string;
    country = country as string;

    loader.color = "green";
    loader.text = `Scraping ${postalCode}...`;
    await page.goto(
      `https://www.loblaws.ca/store-locator?searchQuery=${postalCode}`,
      {
        waitUntil: "networkidle2",
      }
    );

    if (!popupDeleted) {
      await page.waitForSelector(".modal-dialog__content__close");
      const popupButton = await page.$(".modal-dialog__content__close");

      await popupButton!.click();
      popupDeleted = true;
    }

    await page.waitForSelector(".location-set-store__button:first-of-type", {
      timeout: 60 * 1000,
    });
    await page.click(".location-set-store__button:first-of-type");
    await page.waitForSelector(
      ".fulfillment-location-confirmation__actions__button",
      {
        timeout: 15 * 60 * 1000,
      }
    );
    await page.click(".fulfillment-location-confirmation__actions__button");

    for (const item of items) {
      try {
        loader.color = "green";
        loader.text = `${defaultItems.indexOf(item)}/${
          defaultItems.length
        } - ${stores.map((store) => store.postalCode).indexOf(postalCode)}/${
          stores.length
        }| (${storeIndexes.itemIndex} / ${
          storeIndexes.storeIndex
        }) ${item} at ${postalCode}`;

        await page.goto(`https://www.loblaws.ca/search?search-bar=${item}`, {});
        await page.waitForSelector(".product-tile__thumbnail__image", {
          timeout: 60 * 1000,
        });

        //retrieves the value of the first 3 items
        const results = await page.evaluate(() => {
          const results = [];

          const name = document.getElementsByClassName(
            "product-name__item product-name__item--name"
          );
          const price = document.querySelectorAll(
            ".selling-price-list__item__price--now-price__value"
          );
          const img = document.querySelectorAll(
            ".product-tile__thumbnail__image > img"
          );

          //finds a maximum of 3 of each item
          const totalIters = name.length > 3 ? 3 : name.length;

          let i = 0;
          while (i < totalIters) {
            results.push({
              name: (<HTMLElement>name[i]).innerText,
              price: (<HTMLElement>price[i]).innerText,
              imgUrl: (<HTMLImageElement>img[i]).src,
            });
            i++;
          }

          return results;
        });

        //inserts information to database
        let company = await Company.findOne({
          where: { name: "Loblaws" },
        });

        if (!company) {
          company = new Company({ id: uuidv4(), name: "Loblaws" });
          await company.save();
        }

        let store = await Store.findOne({
          where: { postalCode, companyId: company.id },
        });
        if (!store) {
          store = new Store({
            id: uuidv4(),
            name: "Loblaws",
            street,
            city,
            province,
            country,
            postalCode,
            companyId: company.id,
          });

          await store.save();
        }

        for (const result of results) {
          loader.text = `${defaultItems.indexOf(item)}/${
            defaultItems.length
          } - ${stores.map((store) => store.postalCode).indexOf(postalCode)}/${
            stores.length
          }| (${storeIndexes.itemIndex} / ${
            storeIndexes.storeIndex
          }) ${item} at ${postalCode} |(${result.name} for ${result.price})`;

          let itemObj = await Item.findOne({
            where: { name: result.name, storeId: store.id },
          });

          if (!itemObj) {
            itemObj = new Item({
              id: uuidv4(),
              name: result.name,
              storeId: store.id,
              imgUrl: result.imgUrl,
            });

            await itemObj.save();
          } else if (itemObj.category !== item2category[item]) {
            itemObj.category = item2category[item];
            await itemObj.save();
          }

          const itemPrice = new Price({
            id: uuidv4(),
            price: parseFloat(result.price.slice(1)),
            itemId: itemObj.id,
          });

          await itemPrice.save();
        }
        itemBar.increment(1);
        storeIndexes.itemIndex++;
      } catch (e) {
        continue;
      }
    }

    // if itemStart is set, reset it back to the original for the next store
    if (items.length !== defaultItems.length) {
      items = defaultItems;
    }

    storeIndexes.storeIndex++;
    storeBar.increment(1);
    itemBar.update(0);
  }

  itemBar.update(items.length);
  storeBar.stop();
  itemBar.stop();
  multiBar.stop();
  loader.stop();

  await browser.close();

  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(msToTime(timeTaken));
}
