import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";

import { defaultItems, getCompanyId, getStoreId, loaderDisplay, msToTime, updateItems } from "../utils/scrapers.js";

export async function getPricesMetro(
  stores: Address[],
  items: string[],
  storeIndexes: StoreIndexes,
  storeStart: number = 0
) {
  if (stores.length === 0) {
    return;
  }

  const startTime = Date.now();

  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: process.argv.includes("--debug") ? false : "new",
    ignoreHTTPSErrors: true,
    defaultViewport: {
      height: 0,
      width: 0,
    },
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.Metro.ca/", ["geolocation"]);

  // await page.setRequestInterception(true);

  // page.on("request", (req) => {
  //   if (req.resourceType() === "stylesheet" || req.resourceType() === "font")
  //     req.abort();
  //   else req.continue();
  // });

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
      format: "Metro |" + colors.cyan("{bar}") + "| {percentage}% | {value}/{total} Stores",
      hideCursor: true,
    }
  );

  const itemBar = multiBar.create(
    defaultItems.length,
    items.length !== defaultItems.length ? defaultItems.length - items.length : 0,
    {},
    {
      format: "Items |" + colors.magenta("{bar}") + "| {percentage}% | {value}/{total} Items",
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
      message: `Starting Metro Scraper`,
    })
  ).start();

  const companyId = await getCompanyId("Metro");

  const postalCodes = stores.map((store) => store.postalCode);

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, postalCode, province, country, street } = store;

    postalCode = postalCode as string;
    province = province as string;
    country = country as Country;

    const storeId = await getStoreId({
      street,
      city,
      province,
      country: "canada",
      postalCode,
      companyId,
      name: "Metro",
    });

    loader.color = "green";
    loader.text = loaderDisplay({
      ...starterLoaderDisplay,
      storeIndex: postalCodes.indexOf(postalCode),
      message: `Scraping ${postalCode}...`,
    });

    await page.goto("https://www.metro.ca/en", {
      waitUntil: "domcontentloaded",
    });


    await page.waitForSelector("#header-choose-new-service-pickup-btn", {
      visible: true,
      timeout: 999999,
    });
    await page.waitForTimeout(500);
    await page.click("#onetrust-reject-all-handler");
    await page.waitForTimeout(1000);
    await page.click("#header-choose-new-service-pickup-btn");
    await page.waitForSelector("#deliveryPostalCode");
    await page.waitForTimeout(500);
    await page.type("#deliveryPostalCode", postalCode, { delay: 100 });
    await page.waitForTimeout(500);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    if (await page.$("#popupIntercept")) {
      await page.click("#popupIntercept > .close > a");
    }

    await page.waitForSelector(".expand-store-list");
    await page.click(".expand-store-list");

    await page.waitForSelector(".cart-setup__store");
    await page.click(".cart-setup__store");

    await page.waitForSelector("#serviceNext");
    await page.click("#serviceNext");
    
    await page.waitForSelector(".cta-basic-primary.timeslot-confirm.except-mobile");

    for (const item of items) {
      //searches up the price of each item
      loader.color = "green";

      const loaderData: LoaderDisplayParams = {
        ...starterLoaderDisplay,
        storeIndex: postalCodes.indexOf(postalCode),
        itemIndex: items.indexOf(item),
      };

      loader.text = loaderDisplay({
        ...loaderData,
        message: `${item} at ${postalCode}`,
      });

      await page.goto(`https://www.metro.ca/en/online-grocery/search?filter=${item}`, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector(".searchOnlineResults", {
        timeout: 999999,
      });
      //retrieves the value of the first 5 items
      const results = await page.evaluate(() => {
        const results = [];

        const items = Array.from(document.querySelectorAll(".searchOnlineResults > .tile-product"));

        const totalIters = Math.min(items.length, 5);

        for (let i = 0; i < totalIters; i++) {
          const item = items[i];

          const imgElem = item.querySelector("picture img") as HTMLImageElement;
          const name = imgElem.alt;
          const imgUrl = imgElem.src;

          const isAveraged = item.querySelector('abbr[title="average"]') !== null;

          let price, unit;

          if (isAveraged) {
            const text = (item.querySelector(".pricing__secondary-price > span") as HTMLElement).innerText;
            unit = text.split("/")[1].trim();
            price = parseFloat(text.split("/")[0].trim().slice(1));
          } else {
            if (!item.querySelector(".head__unit-details")) {
              continue;
            }
            unit = (item.querySelector(".head__unit-details") as HTMLElement).innerText;

            price = parseFloat(
              (item.querySelector("div[data-main-price]") as HTMLElement).getAttribute("data-main-price")!
            );
          }

          results.push({
            name,
            imgUrl,
            price,
            unit,
          });
        }

        return results;
      });

      loader.text = loaderDisplay({
        ...loaderData,
        message: `Inserting the prices of ${results.length} item(s)`,
      });

      await updateItems({
        results,
        storeId,
      });

      loader.text = loaderDisplay({
        ...loaderData,
        message: `Successfully inserted prices!`,
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
