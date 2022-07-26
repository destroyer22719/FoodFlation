import fs from "fs";
import path from "path";
import yargs from "yargs/yargs";
import { getPricesLoblaws } from "./loblaws.js";
import { Address, CompanyName } from "./global.js";
import { getPricesMetro } from "./metro.js";

const __dirname = path.resolve();

const argv = yargs(process.argv.slice(2))
    .options({
        province: { type: "string", demandOption: true },
        metro: { type: "boolean", demand: false, default: false },
        loblaws: { type: "boolean", demand: false, default: false },
        storeStart: { type: "number", demand: false, default: 1 },
        itemStart: { type: "number", demand: false, default: 1 },
    })
    .parseSync();

export const filterByStore = (
    array: Address[],
    company: CompanyName
): Address[] => {
    return array.filter((store) => store.company === company);
};

export const msToTime = (ms: number): string => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours > 0 ? `${hours}h` : ""} ${minutes}m ${seconds}s`;
};

async function scrapePrices() {
    const province = argv.province;
    const { stores } = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", province, "stores.json"),
            "utf-8"
        )
    );

    const { items } = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "items.json"),
            "utf-8"
        )
    );

    if (argv.loblaws) {
        await getPricesLoblaws(
            items,
            stores,
            argv.storeStart,
            argv.itemStart
        );
    } else if (argv.metro) {
        await getPricesMetro(
            items,
            stores,
            argv.storeStart,
            argv.itemStart
        );
    } else {
        await getPricesLoblaws(
            items,
            filterByStore(stores, "Loblaws"),
            argv.storeStart,
            argv.itemStart
        );
        await getPricesMetro(
            items,
            filterByStore(stores, "Metro"),
            argv.storeStart,
            argv.itemStart
        );
    }
}

(async () => {
    await scrapePrices();
    setInterval(() => {
        (async () => {
            await scrapePrices();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
