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

export async function getPricesWholeFoodsMarket(
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
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.wholefoodsmarket.com/stores", [
    "geolocation",
  ]);

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
        "Whole Foods Market |" +
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
        "Items              |" +
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

  const companyId = await getCompanyId("Whole Foods Market");

  const zipCodes = stores.map((store) => store.zipCode);

  for (const store of stores) {
    let { city, zipCode, state, country, street } = store;

    state = state as string;
    zipCode = zipCode as string;
    country = country as Country;

    const storeId = await getStoreId({
      street,
      city,
      state,
      zipCode,
      country: "us",
      companyId,
      name: "Target",
    });

    loader.color = "green";
    loader.text = loaderDisplay({
      ...starterLoaderDisplay,
      storeIndex: zipCodes.indexOf(zipCode),
      storeScrapedIndex: storeIndexes.storeIndex,
      message: `Searching for ${zipCode}`,
    });

    await page.goto("https://www.wholefoodsmarket.com/stores", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector("#store-finder-search-bar");
    const zipInput = await page.$("#store-finder-search-bar");

    await zipInput?.type(zipCode);
    await page.waitForTimeout(500);
    await zipInput?.press("Enter");

    //clicking on the right store
    await page.waitForTimeout(2500);
    await page.waitForSelector(
      "wfm-store-list li:nth-child(1) wfm-store-selector > span",
      {
        visible: true,
        timeout: 5000,
      }
    );

    await page.click(
      "wfm-store-list li:nth-child(1) wfm-store-selector > span"
    );

    await page.waitForSelector(".w-mystore", {
      timeout: 1000 * 60,
    });

    for (const item of items) {
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

      await page.goto(`https://www.wholefoodsmarket.com/search?text=${item}`, {
        waitUntil: "domcontentloaded",
      });

      try {
        const notFound = await page.$(`.w-pie--no-results__header`);
        if (notFound) {
          throw new Error();
        }
      } catch (err) {
        continue;
      }

      await page.waitForSelector(".w-pie--product-tile__image", {
        visible: true,
        timeout: 15000,
      });

      const results = await page.evaluate(() => {
        const itemCards = Array.from(
          document.querySelectorAll(".w-pie--product-tile")
        ) as HTMLElement[];

        const iterations = Math.min(itemCards.length, 5);

        const resultData = [];

        for (let i = 0; i < iterations; i++) {
          const itemCard = itemCards[i];
          const name = (
            itemCard.querySelector(
              `h2[data-testid="product-tile-name"]`
            ) as HTMLElement
          )?.innerText;

          const imgUrl =
            (
              itemCard.querySelector(
                ".w-pie--product-tile__image img"
              ) as HTMLImageElement | null
            )?.getAttribute("src") || "";

          const salesPriceElem = itemCard.querySelector(
            ".sale_price"
          ) as HTMLElement | null;

          let price = null;
          let unitOfMeasurement = "unit";

          if (salesPriceElem && !salesPriceElem.innerText.includes("for")) {
            price = parseFloat(
              salesPriceElem.innerText.match(/(?<=\$)\d+(\.\d{2})?/gm)![0]
            );
          } else {
            const regularPrice = (
              itemCard.querySelector(".regular_price") as HTMLElement
            ).innerText;
            if (regularPrice.includes("/")) {
              unitOfMeasurement = regularPrice.split("/")[1].trim();
              if (unitOfMeasurement === "lb") {
                unitOfMeasurement = "pound";
              } else if (unitOfMeasurement === "oz") {
                unitOfMeasurement = "ounce";
              } else if (unitOfMeasurement === "gal") {
                unitOfMeasurement = "gallon";
              }
            }

            price = parseFloat(regularPrice.split("/")[0].slice(1));
          }

          resultData.push({
            name,
            price,
            imgUrl,
            unit: unitOfMeasurement,
          });
        }

        return resultData;
      });

      loader.text = loader.text = loaderDisplay({
        ...loaderData,
        message: `Inserting the price of ${results.length} item(s)`,
      });

      await updateItems({
        storeId,
        results,
      });

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

    storeBar.increment(1);
    storeIndexes.storeIndex++;
    itemBar.update(0);
  }

  itemBar.update(defaultItems.length);

  storeBar.stop();
  itemBar.stop();
  multiBar.stop();
  loader.stop();
  await browser.close();

  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(msToTime(timeTaken));
}
