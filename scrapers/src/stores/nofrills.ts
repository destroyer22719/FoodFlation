import puppeteer from "puppeteer";
import cliProgress from "cli-progress";
import ora from "ora";
import colors from "ansi-colors";

import {
  defaultItems,
  getCompanyId,
  getStoreId,
  msToTime,
  updateItem,
} from "../utils/scrapers.js";

export async function getPricesNoFrills(
  stores: Address[],
  items: string[],
  storeIndexes: StoreIndexes,
  storeStart: number = 0
) {
  if (stores.length === 0) {
    return;
  }

  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.nofrills.ca/store-locator?", [
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
        "No Frills |" +
        colors.cyan("{bar}") +
        "| {percentage}% | {value}/{total} Stores",
      hideCursor: true,
    }
  );

  const itemBar = multiBar.create(
    items.length,
    items.length !== defaultItems.length
      ? defaultItems.length - items.length
      : 0,
    {},
    {
      format:
        "Items     |" +
        colors.magenta("{bar}") +
        "| {percentage}% | {value}/{total} Items",
      hideCursor: true,
    }
  );

  //this is a cheap workaround for combining multiple bars with ora spinners
  multiBar.create(0, 0);

  const loader = ora("Scraping No Frills...").start();

  let popupDeleted = false;

  const companyId = await getCompanyId("No Frills");

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, postalCode, province, country, street } = store;

    postalCode = postalCode as string;
    province = province as string;
    country = country as Country;

    loader.color = "green";
    loader.text = `Scraping ${postalCode}...`;
    await page.goto(
      `https://www.nofrills.ca/store-locator?searchQuery=${postalCode}`,
      {
        waitUntil: "networkidle2",
      }
    );

    const storeId = await getStoreId({
      companyId,
      postalCode,
      province,
      country,
      street,
      city,
    });

    if (!popupDeleted) {
      page.evaluate(() => {
        const popupButton: HTMLElement | null = document.querySelector(
          ".modal-dialog__content__close"
        );
        if (popupButton) {
          popupButton.click();
        }
      });
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
        await page.goto(
          `https://www.nofrills.ca/search?search-bar=${item}`,
          {}
        );

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

        for (const result of results) {
          loader.text = `${items.indexOf(item)}/${items.length} - ${stores
            .map((store) => store.postalCode)
            .indexOf(postalCode)}/${stores.length}| (${
            storeIndexes.itemIndex
          } / ${storeIndexes.storeIndex}) ${item} at ${postalCode} |(${
            result.name
          } for ${result.price})`;

          await updateItem({
            storeId,
            result,
          });
        }
        itemBar.increment(1);
        storeIndexes.itemIndex++;
      } catch (e) {
        continue;
      }
    }
    items = items;
    storeBar.increment(1);
    storeIndexes.storeIndex++;
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
