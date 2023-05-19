import yargs from "yargs/yargs";
import { generateStoresToScrape, scrapeStores } from "./utils/cli.js";

// console.log(`
//   - include a new field, unit, to represent the unit of measurement for the price of the item
//   - investigate issue with whole foods market and fix it and investigate if there are any other stores with the same issue with different child elements which corresponds to prices, item, and img not corresponding to each other
//   - start with:$ npm run scrape:prod -- --usa --storeStart=7 --itemStart=9
// `)

// process.exit(1);

const argv = yargs(process.argv.slice(2))
  .options({
    storeStart: { type: "number", demand: false, default: 0 },
    itemStart: { type: "number", demand: false, default: 0 },
    all: { type: "boolean", demand: false, default: false },
    state: { type: "string", demandOption: false },
    province: { type: "string", demandOption: false },
    metro: { type: "boolean", demand: false, default: false },
    loblaws: { type: "boolean", demand: false, default: false },
    noFrills: { type: "boolean", demand: false, default: false },
    wholeFoodsMarket: { type: "boolean", demand: false, default: false },
    target: { type: "boolean", demand: false, default: false },
    aldi: { type: "boolean", demand: false, default: false },
    canada: { type: "boolean", demand: false, default: false },
    usa: { type: "boolean", demand: false, default: false },
  })
  .parseSync();

export const storeStartSet = argv.storeStart !== 0;

const indexes: StoreIndexes = {
  storeIndex: 0,
  itemIndex: 0,
  storeTotal: 0,
  itemTotal: 0,
};

if (argv.all) {
  const storesToScrape = generateStoresToScrape(indexes, {
    itemStart: argv.itemStart,
    storeStart: argv.storeStart,
  });

  await scrapeStores(storesToScrape, indexes);
} else if (argv.canada) {
  let canadianStoreOptions: CanadianStoresOptions | undefined;

  if (argv.metro || argv.loblaws || argv.noFrills) {
    canadianStoreOptions = {
      metro: argv.metro,
      loblaws: argv.loblaws,
      noFrills: argv.noFrills,
    };
  }

  const storesToScrape = generateStoresToScrape(indexes, {
    canadaOnly: true,
    itemStart: argv.itemStart,
    storeStart: argv.storeStart,
    province: argv.province as Province,
    canadianStoreOptions,
  });

  await scrapeStores(storesToScrape, indexes);
} else if (argv.usa) {
  let americanStoreOptions: AmericanStoresOptions | undefined;

  if (argv.wholeFoodsMarket || argv.target || argv.aldi) {
    americanStoreOptions = {
      wholeFoodsMarket: argv.wholeFoodsMarket,
      target: argv.target,
      aldi: argv.aldi,
    };
  }

  const storesToScrape = generateStoresToScrape(indexes, {
    usOnly: true,
    itemStart: argv.itemStart,
    storeStart: argv.storeStart,
    state: argv.state as State,
    americanStoreOptions,
  });

  await scrapeStores(storesToScrape, indexes);
}
