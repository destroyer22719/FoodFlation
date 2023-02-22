import yargs from "yargs/yargs";
import { Province, State, StoreIndex } from "./global.js";
import { generateStoresToScrape, scrapeStores} from "./util.js";

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

const indexes: StoreIndex = {
  storeIndex: 0,
  itemIndex: 0,
  storeTotal: 0,
  itemTotal: 0,
};

if (argv.all) {
  const storesToScrape = generateStoresToScrape(
    indexes, 
    {
      itemStart: argv.itemStart,
      storeStart: argv.storeStart,
    }
  )

  await scrapeStores(storesToScrape, indexes)
}

