import puppeteer from "puppeteer";
import cliProgress from "cli-progress";
import ora from "ora";
import colors from "ansi-colors";

import {
  defaultItems,
  getCompanyId,
  msToTime,
  updateItems,
  getStoreId,
  loaderDisplay,
} from "../utils/scrapers.js";

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

  const browser = await puppeteer.launch({
    headless: process.argv.includes("--debug") ? false : "new",
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
      message: `Starting Loblaws Scraper`,
    })
  ).start();

  let popupDeleted = false;

  const companyId = await getCompanyId("Loblaws");

  const postalCodes = stores.map((store) => store.postalCode);

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, postalCode, province, country, street } = store;

    postalCode = postalCode as string;
    province = province as string;
    country = country as Country;

    const storeId = await getStoreId({
      companyId,
      city,
      street,
      country: "canada",
      province,
      postalCode,
      name: "Loblaws",
    });

    loader.color = "green";
    loader.text = loaderDisplay({
      ...starterLoaderDisplay,
      storeIndex: postalCodes.indexOf(postalCode),
      message: `Scraping ${postalCode}...`,
    });

    await page.goto(
      `https://www.loblaws.ca/store-locator?searchQuery=${postalCode}`,
      {
        waitUntil: "networkidle2",
      }
    );

    if (!popupDeleted) {
      const popupButton = await page.$(".modal-dialog__content__close");
      if (popupButton) {
        await popupButton!.click();
      }

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

      await page.goto(`https://www.loblaws.ca/search?search-bar=${item}`, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector(".product-tile-group__list__item", {
        visible: true,
        timeout: 60 * 1000,
      });
      await page.waitForSelector(".product-tile__thumbnail__image > img", {
        visible: true,
        timeout: 60 * 1000,
      });
      await page.waitForSelector(".island-block.island-block--ProductGrid", {
        visible: true,
        timeout: 60 * 1000,
      });
      await page.waitForSelector(
        ".quantity-selector--add-to-cart.quantity-selector--add-to-list-button",
        {
          visible: true,
          timeout: 60 * 1000,
        }
      );

      await page.waitForTimeout(5000)

      //retrieves the value of the first 5 items
      const results = await page.evaluate(() => {
        const results = [];

        const items = document.querySelectorAll(
          ".product-tile-group__list__item"
        );
        let totalIters = Math.min(items.length, 5);

        let i = 0;
        while (i < totalIters) {
          const isSponsored =
            (
              items[i].querySelector(
                ".product-tile__eyebrow>.product-badge__text.product-badge__text--product-tile"
              ) as HTMLElement
            ).innerText !== "";
          if (isSponsored) {
            i++;
            totalIters++;
            continue;
          }

          const brand =
            (
              items[i].querySelector(
                ".product-name.product-name--product-tile .product-name__item--brand"
              ) as HTMLElement
            )?.innerText ?? "";
          const name = (
            items[i].querySelector(
              ".product-name.product-name--product-tile .product-name__item--name"
            ) as HTMLElement
          ).innerText;

          let price: number;
          let unit: string;

          const isEstimate =
            (
              (items[i].querySelector(
                ".price__type.selling-price-list__item__price.selling-price-list__item__price--now-price__type"
              ) as HTMLElement) || null
            )?.innerText === "(est.)";

          if (isEstimate) {
            price = parseFloat(
              (
                items[i].querySelectorAll(
                  ".price__value.comparison-price-list__item__price__value"
                )[1] as HTMLElement
              ).innerText.slice(1)
            );
            unit = (
              items[i].querySelectorAll(
                ".price__unit.comparison-price-list__item__price__unit"
              )[1] as HTMLElement
            ).innerText.slice(2);
          } else {
            unit = (
              items[i].querySelector(
                ".product-name.product-name--product-tile .product-name__item--package-size"
              ) as HTMLElement
            ).innerText;
            price = parseFloat(
              (
                items[i].querySelector(
                  ".price__value.selling-price-list__item__price.selling-price-list__item__price--now-price__value"
                ) as HTMLElement
              ).innerText.slice(1)
            );
          }

          const imgUrl = (
            items[i].querySelector(
              ".product-tile__thumbnail__image > img"
            ) as HTMLImageElement
          ).src;

          results.push({
            name: `${brand ? `${brand}, ` : ""} ${name} ${
              !isEstimate ? `(${unit})` : ""
            }`.trim(),
            price,
            imgUrl,
            unit,
          });
          i++;
        }
        return results;
      });

      loader.text = loaderDisplay({
        ...loaderData,
        message: `Inserting the prices of ${results.length} item(s)`,
      });

      await updateItems({
        storeId,
        results,
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
