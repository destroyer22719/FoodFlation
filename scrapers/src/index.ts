import yargs from "yargs/yargs";
import { Province, State } from "./global.js";
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
        wholeFoodsMarket: { type: "boolean", demand: false, default: false },
        aldi: { type: "boolean", demand: false, default: false },
        canada: { type: "boolean", demand: false, default: false },
        usa: { type: "boolean", demand: false, default: false },
    })
    .parseSync();

(async () => {
    if (argv.all) {
        await scrapeAll({
            storeStart: argv.storeStart,
            itemStart: argv.itemStart,
            province: argv.province,
            state: argv.state,
            metro: argv.metro,
            loblaws: argv.loblaws,
            wholeFoodsMarket: argv.wholeFoodsMarket,
        });
    } else if (argv.canada) {
        await scrapeCanada({
            storeStart: argv.storeStart,
            itemStart: argv.itemStart,
            province: argv.province as Province,
            metro: argv.metro,
            loblaws: argv.loblaws,
        });
    } else if (argv.usa) {
        await scrapeAmerica({
            storeStart: argv.storeStart,
            itemStart: argv.itemStart,
            state: argv.state as State,
            wholeFoodsMarket: argv.wholeFoodsMarket,
            aldi: argv.aldi,
        });
    }
})();
