import puppeteer from "puppeteer";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import sequelize from "../db.js";
import Price from "../../../backend/src/model/Price.js";
import Item from "../../../backend/src/model/Item.js";
import Store from "../../../backend/src/model/Store.js";
import Company from "../../../backend/src/model/Company.js";
import { Address } from "../global.js";
import { msToTime } from "../util.js";
import states from "states-us";

const __dirname = path.resolve();

export async function getPricesAldi(
  itemsArray: string[],
  storesArray: Address[],
  storeStart: number = 0,
  itemStart: number = 0
) {
  const stores = storesArray.slice(storeStart);

  if (stores.length === 0) {
    console.log("No Aldi's stores found");
    return;
  }

  let items = itemsArray.slice(itemStart);

  const startTime = Date.now();

  await sequelize.sync();

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(
    "https://shop.aldi.us/store/aldi/storefront/",
    ["geolocation"]
  );

  const multiBar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  );

  const storeBar = multiBar.create(
    storesArray.length,
    storeStart,
    {},
    {
      format:
        "Aldi |" +
        colors.cyan("{bar}") +
        "| {percentage}% | {value}/{total} Stores",
      hideCursor: true,
    }
  );

  const itemBar = multiBar.create(
    itemsArray.length,
    itemStart,
    {},
    {
      format:
        "Items|" +
        colors.magenta("{bar}") +
        "| {percentage}% | {value}/{total} Items",
      hideCursor: true,
    }
  );

  //this is a cheap workaround for combining multiple bars with ora spinners
  multiBar.create(0, 0);

  const loader = ora("Scraping Aldi...").start();

  const item2category = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "config", "item2category.json"),
      "utf-8"
    )
  );

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, zipCode, state, country, street } = store;

    zipCode = zipCode as string;
    state = state as string;
    country = country as string;

    loader.color = "green";
    loader.text = `Scraping ${zipCode}...`;
    // @ts-ignore
    const stateAbbr = states.default
      // @ts-ignore
      .filter((s) => s.name === state)[0]
      .abbreviation.toLowerCase();

    const urlCity = city.replaceAll(" ", "-").toLowerCase();
    const urlAdr = street.replaceAll(" ", "-").toLowerCase();
    await page.goto(
      `https://stores.aldi.us/${stateAbbr}/${urlCity}/${urlAdr}`,
      {
        waitUntil: "domcontentloaded",
      }
    );
    await page.click(".Hero-cta--primary");
    await page.waitForSelector('span[class*="AddressButton"]');
    for (const item of items) {
      //searches up the price of each item
      loader.color = "green";
      loader.text = `${itemsArray.indexOf(item)}/${
        itemsArray.length
      } - ${storesArray.map((store) => store.zipCode).indexOf(zipCode)}/${
        storesArray.length
      }| ${item} at ${zipCode}`;

      await page.goto(`https://shop.aldi.us/store/aldi/search/${item}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector('span[aria-label*="Original price:"]', {
        timeout: 60 * 60 * 1000,
      });
      //retrieves the value of the first 3 items
      const results = await page.evaluate(() => {
        const results = [];
        const name = document.querySelectorAll("li h2");
        const price = document.querySelectorAll(
          'span[aria-label*="Original price:"]'
        );
        const img = document.querySelectorAll("li img[srcset]");

        //finds a maximum of 3 of each item
        const totalIters = name.length > 3 ? 3 : name.length;
        for (let i = 0; i < totalIters; i++) {
          results.push({
            name: (<HTMLElement>name[i]).innerText,
            price: (<HTMLElement>price[i]).innerText.slice(1),
            imgUrl: (<HTMLImageElement>img[i]).srcset.split(", ").filter(url => /\.(jpe?g|png)$/gm.test(url))[0],
          });
        }

        return results;
      });

      //inserts information to database
      let company = await Company.findOne({ where: { name: "Aldi" } });

      if (!company) {
        company = new Company({ id: uuidv4(), name: "Aldi" });
        await company.save();
      }

      let store = await Store.findOne({
        where: { zipCode, companyId: company.id },
      });
      if (!store) {
        store = new Store({
          id: uuidv4(),
          name: "Aldi",
          street,
          city,
          state,
          country,
          zipCode,
          companyId: company.id,
        });

        await store.save();
      }

      for (const result of results) {
        loader.text = `${itemsArray.indexOf(item)}/${
          itemsArray.length
        } - ${storesArray.map((store) => store.zipCode).indexOf(zipCode)}/${
          storesArray.length
        }|${item} at ${zipCode} |(${result.name} for ${result.price})`;

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
          price: parseFloat(result.price),
          itemId: itemObj.id,
        });

        await itemPrice.save();
      }
      itemBar.increment(1);
    }
    items = itemsArray;
    storeBar.increment(1);
    itemBar.update(0);
  }

  itemBar.update(itemsArray.length);

  storeBar.stop();
  itemBar.stop();
  multiBar.stop();
  loader.stop();
  await browser.close();

  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(msToTime(timeTaken));
}