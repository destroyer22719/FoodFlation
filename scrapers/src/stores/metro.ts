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

  const browser = await puppeteer.launch({
    headless: !process.argv.includes("--debug"),
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  //disables location
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.Metro.ca/cp/grocery", [
    "geolocation",
  ]);

  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (req.resourceType() === "stylesheet" || req.resourceType() === "font")
      req.abort();
    else req.continue();
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
        "Metro |" +
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
        "Items |" +
        colors.magenta("{bar}") +
        "| {percentage}% | {value}/{total} Items",
      hideCursor: true,
    }
  );

  //this is a cheap workaround for combining multiple bars with ora spinners
  multiBar.create(0, 0);

  const loader = ora("Scraping Metro...").start();

  const companyId = await getCompanyId("Metro");

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
      country,
      postalCode,
      companyId,
    });

    loader.color = "green";
    loader.text = `Scraping ${postalCode}...`;
    await page.goto("https://www.metro.ca/en/find-a-grocery");

    await page.waitForSelector("#postalCode");
    await page.$eval(
      "#postalCode",
      (input, pc) => ((input as HTMLInputElement).value = pc as string),
      postalCode
    );

    await page.click("#submit");
    await page.waitForTimeout(5000);
    await page.click(
      "#mapResults > li:nth-child(1) > div.white-wrapper > div > div.row.no-gutters.justify-content-between.align-items-center > div:nth-child(1) > button"
    );
    await page.waitForNavigation();

    for (const item of items) {
      //searches up the price of each item
      loader.color = "green";
      loader.text = `${defaultItems.indexOf(item)}/${
        defaultItems.length
      } - ${stores.map((store) => store.postalCode).indexOf(postalCode)}/${
        stores.length
      }| (${storeIndexes.itemIndex} / ${
        storeIndexes.storeIndex
      }) ${item} at ${postalCode}`;
      await page.goto(`https://www.metro.ca/en/search?filter=${item}`, {
        waitUntil: "domcontentloaded",
      });

      //retrieves the value of the first 3 items
      const results = await page.evaluate(() => {
        const results = [];
        const name = Array.from(
          document.querySelectorAll(".defaultable-picture > img")
        ).map((x) => (x as HTMLImageElement).alt); // const price = document.querySelectorAll(".pi--main-price");

        let prices = Array.from(document.querySelectorAll(".price-update")).map(
          (x) => (x as HTMLElement).innerText.slice(1)
        );
        const prodTile = Array.from(document.querySelectorAll(".tile-product"));

        const img = Array.from(
          document.querySelectorAll(".defaultable-picture > img")
        ).map((x) => (x as HTMLImageElement).src);

        const totalIters = name.length > 3 ? 3 : name.length;
        for (let i = 0; i < totalIters; i++) {
          let price = prices[i];
          //for in case there is a promotion like 2 / $5 then use the price of per unit
          if (price.includes("/")) {
            price = (prodTile[i].querySelector(
              ".pricing__secondary-price > span"
            ) as HTMLElement)!.innerText.slice(4);
            prices.splice(i + 1, 1);
          }
          results.push({
            name: name[i],
            price: price,
            imgUrl: img[i],
          });
        }

        return results;
      });

      for (const result of results) {
        loader.text = `${defaultItems.indexOf(item)}/${
          defaultItems.length
        } - ${stores.map((store) => store.postalCode).indexOf(postalCode)}/${
          stores.length
        }| (${storeIndexes.itemIndex} / ${
          storeIndexes.storeIndex
        }) ${item} at ${postalCode} |(${result.name} for ${result.price})`;

        await updateItem({
          result,
          storeId,
        });
      }

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
