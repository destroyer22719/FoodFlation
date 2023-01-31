import yargs from "yargs/yargs";
import { Province, State, StoreIndex } from "./global.js";
import { scrapeAll, scrapeAmerica, scrapeCanada } from "./util.js";

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
  await scrapeAll(
    argv.province as Province,
    argv.state as State,
    argv.storeStart,
    argv.itemStart,
    {
      metro: argv.metro,
      loblaws: argv.loblaws,
      noFrills: argv.noFrills,
      wholeFoodsMarket: argv.wholeFoodsMarket,
      aldi: argv.aldi,
    },
    indexes
  );
} else if (argv.canada) {
  await scrapeCanada(
    argv.province as Province,
    argv.storeStart,
    argv.itemStart,
    { metro: argv.metro, loblaws: argv.loblaws, noFrills: argv.noFrills },
    indexes
  );
} else if (argv.usa) {
  await scrapeAmerica(argv.state as State, argv.storeStart, argv.itemStart, {
    wholeFoodsMarket: argv.wholeFoodsMarket,
    aldi: argv.aldi,
    target: argv.target,
  },
  indexes);
}
