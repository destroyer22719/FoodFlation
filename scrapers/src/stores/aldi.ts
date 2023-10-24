// @ts-nocheck

import puppeteer from "puppeteer";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";

import {
  defaultItems,
  getCompanyId,
  getStoreId,
  loaderDisplay,
  msToTime,
  updateItems,
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
    headless: process.argv.includes("--debug") ? false : "new",
    // headless: false,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(
    "https://shop.aldi.us/store/aldi/storefront/",
    ["geolocation"]
  );

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (
      ["image", "stylesheet", "font", "other"].includes(request.resourceType())
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

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

  const starterLoaderDisplay: LoaderDisplayParams = {
    itemIndex: 0,
    totalItems: defaultItems.length,
    storeIndex: 0,
    totalStores: stores.length,
    storeScrapedIndex: storeIndexes.storeIndex,
  };

  const loader = ora(
    loaderDisplay({
      ...starterLoaderDisplay,
      message: `Starting Aldi Scraper`,
    })
  ).start();

  const companyId = await getCompanyId("Aldi");
  const zipCodes = stores.map((store) => store.zipCode);

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, zipCode, state, country, street } = store;

    zipCode = zipCode as string;
    state = state as string;
    country = country as Country;

    loader.color = "green";
    loader.text = loaderDisplay({
      ...starterLoaderDisplay,
      storeIndex: zipCodes.indexOf(zipCode),
      message: `Searching for ${zipCode}`,
      storeScrapedIndex: storeIndexes.storeIndex,
    });

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

    await page.waitForSelector('svg[color="systemGrayscale70"]>path[d^="M19"]');
    for (const item of items) {
      //searches up the price of each item
      loader.color = "green";

      const loaderData: LoaderDisplayParams = {
        ...starterLoaderDisplay,
        itemIndex: defaultItems.indexOf(item),
        storeIndex: zipCodes.indexOf(zipCode),
      };

      loader.text = loaderDisplay({
        ...loaderData,
        message: `${item} at ${zipCode}`,
      });

      await page.goto(`https://shop.aldi.us/store/aldi/search/${item}`, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForFunction(
        () => {
          const matches = Array.from(
            document.querySelectorAll('div[aria-label^="$"]')
          );
          return matches.length >= 5 ? matches : null;
        },
        {
          timeout: 60 * 60 * 1000,
        }
      );
      await page.waitForTimeout(2000)
      //retrieves the value of the first 5 items
      const results = await page.evaluate(() => {
        const results = [];

        const items = Array.from(
          document.querySelectorAll('div[aria-label="Product"]')
        );

        const totalIters = Math.min(items.length, 5);
        for (let i = 0; i < totalIters; i++) {
          const item = items[i];
          const price = +item
            .querySelector('div[aria-label^="$"]')!
            .getAttribute("aria-label")!
            .match(/(?<=\$)(\d|\.)+/gm)![0];
          const name = (item.querySelector("a>div+div>div>span") as HTMLElement)
            .innerText;
          const imgUrl = (
            item.querySelector("img[srcset]") as HTMLImageElement
          ).srcset.split(", ")[0];
          let unit =
            (item.querySelector("div[title]") as HTMLElement | null)
              ?.innerText ?? "unit";
          if (unit !== "unit" && unit.includes("/")) {
            unit = "unit";
          }

          results.push({
            name: (<HTMLElement>name[i]).innerText,
            price: (<HTMLElement>price[i])
              .getAttribute("aria-label")!
              .match(/(?<=\$)(\d|\.)+/gm)![0],
            imgUrl: (<HTMLImageElement>img[i]).srcset
              .split(", ")
              .filter((url) => /\.(jpe?g|png)$/gm.test(url))[0],
          });
        }

        return results;
      });

      loader.text = loader.text = loaderDisplay({
        ...loaderData,
        message: `Inserting the price of ${results.length} item(s)`,
      });

      await updateItems({ results, storeId });

      loader.text = loader.text = loaderDisplay({
        ...loaderData,
        message: `Successfully inserted prices`,
      });

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
