import cliProgress from "cli-progress";
import ora from "ora";
import colors from "ansi-colors";

import { defaultItems, getCompanyId, msToTime, updateItems, getStoreId, loaderDisplay } from "../utils/scrapers.js";

export default async function getPricesNoFrills(
  stores: Address[],
  items: string[],
  storeIndexes: StoreIndexes,
  storeStart: number = 0
) {
  if (stores.length === 0) {
    return;
  }

  const startTime = Date.now();

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
      format: "No Frills |" + colors.cyan("{bar}") + "| {percentage}% | {value}/{total} Stores",
      hideCursor: true,
    }
  );

  const itemBar = multiBar.create(
    defaultItems.length,
    items.length !== defaultItems.length ? defaultItems.length - items.length : 0,
    {},
    {
      format: "Items     |" + colors.magenta("{bar}") + "| {percentage}% | {value}/{total} Items",
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
      message: `Starting No Frills Scraper`,
    })
  ).start();

  const companyId = await getCompanyId("No Frills");

  const postalCodes = stores.map((store) => store.postalCode);

  for (const store of stores) {
    //searches up store postal code directly and set the store location
    let { city, postalCode, province, country, street, otherId } = store;

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
      name: "No Frills",
    });

    loader.color = "green";
    loader.text = loaderDisplay({
      ...starterLoaderDisplay,
      storeIndex: postalCodes.indexOf(postalCode),
      message: `Scraping ${postalCode}...`,
    });

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

      const req = await fetch("https://api.pcexpress.ca/product-facade/v3/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": " 1im1hL52q9xvta16GlSdYDsTsG0dmyhF",
        },
        body: JSON.stringify({
          pagination: {
            from: 0,
            size: 10,
          },
          lang: "en",
          storeId: otherId,
          banner: "nofrills",
          pickupType: "STORE",
          term: item,
          cartId: "9aaf26ca-190e-44e1-9a89-4b233fd48ef2",
        }),
      });
      const res: LoblawsApiRes = await req.json();
      const { results } = res;

      const resultsParsed = results
        .filter(({ imageAssets }) => {
          if (!imageAssets) {
            return false;
          }
          return true;
        })
        .map((result) => {
          const { prices, name, brand, imageAssets, packageSize } = result;

          let price: number, unit: string;

          if (!packageSize && prices.price.unit === "ea") {
            if (prices.comparisonPrices.length >= 2) {
              price = prices.comparisonPrices[1].value;
              unit = prices.comparisonPrices[1].unit;
            } else {
              price = prices.comparisonPrices[0].value;
              unit = prices.comparisonPrices[0].unit;
            }
          } else if (!packageSize && prices.price.unit !== "ea") {
            price = prices.price.value;
            unit = `${prices.price.quantity}${prices.price.unit}}`;
          } else {
            price = prices.price.value;
            unit = packageSize;
          }

          return {
            price,
            name: `${brand ? `${brand},` : ""} ${name} ${packageSize ? `(${packageSize})` : ""}`.trim(),
            imgUrl: imageAssets[0].mediumUrl,
            unit,
          };
        });

      loader.text = loaderDisplay({
        ...loaderData,
        message: `Inserting the prices of ${results.length} item(s)`,
      });

      await updateItems({
        storeId,
        results: resultsParsed,
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

  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(msToTime(timeTaken));
}
