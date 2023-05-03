import puppeteer from "puppeteer";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";

import {
  defaultItems,
  getCompanyId,
  getStoreId,
  msToTime,
  updateItem,
} from "../utils/scrapers.js";

export async function getPricesAldi(
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
    headless: !process.argv.includes("--debug"),
    // headless: false,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
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
    stores.length + storeStart,
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
    defaultItems.length,
    items.length !== defaultItems.length
      ? defaultItems.length - items.length
      : 0,
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

  const companyId = await getCompanyId("Aldi");

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, zipCode, state, country, street } = store;

    zipCode = zipCode as string;
    state = state as string;
    country = country as Country;

    loader.color = "green";
    loader.text = `Scraping ${zipCode}...`;

    const storeId = await getStoreId({
      companyId,
      city,
      zipCode,
      state,
      country: "us",
      street,
      name: "Aldi",
    });

    await page.goto(
      `https://shop.aldi.us/store/aldi/storefront/?current_zip_code=${zipCode}`
    );

    for (const item of items) {
      //searches up the price of each item
      loader.color = "green";
      loader.text = `${defaultItems.indexOf(item)}/${
        defaultItems.length
      } - ${stores.map((store) => store.zipCode).indexOf(zipCode)}/${
        stores.length
      }| (${storeIndexes.itemIndex} / ${
        storeIndexes.storeIndex
      }) ${item} at ${zipCode}`;

      await page.goto(`https://shop.aldi.us/store/aldi/search/${item}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector('div[aria-label^="$"]', {
        timeout: 60 * 60 * 1000,
        visible: true,
      });
      await page.waitForSelector("a>div+div>div>span", {
        timeout: 60 * 60 * 1000,
        visible: true,
      });
      //retrieves the value of the first 3 items
      const results = await page.evaluate(() => {
        const results = [];
        const name = document.querySelectorAll("a>div+div>div>span");
        const price = document.querySelectorAll('div[aria-label^="$"]');
        const img = document.querySelectorAll("li img[srcset]");

        //finds a maximum of 3 of each item
        const totalIters = name.length > 3 ? 3 : name.length;
        for (let i = 0; i < totalIters; i++) {
          results.push({
            name: (<HTMLElement>name[i]).innerText,
            price: parseFloat(
              (<HTMLElement>price[i])
                .getAttribute("aria-label")!
                .match(/(?<=\$)(\d|\.)+/gm)![0]
            ),
            imgUrl: (<HTMLImageElement>img[i]).srcset
              .split(", ")
              .filter((url) => /\.(jpe?g|png)$/gm.test(url))[0],
          });
        }

        return results;
      });

      for (const result of results) {
        loader.text = `${defaultItems.indexOf(item)}/${
          defaultItems.length
        } - ${stores.map((store) => store.zipCode).indexOf(zipCode)}/${
          stores.length
        }| (${storeIndexes.itemIndex} / ${
          storeIndexes.storeIndex
        }) ${item} at ${zipCode} |(${result.name} for ${result.price})`;

        await updateItem({ result, storeId });
      }

      itemBar.increment(1);
      storeIndexes.itemIndex++;
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
