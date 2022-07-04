import fs from "fs";
import path from "path";
import yargs from "yargs/yargs";
import { getPricesLoblaws } from "./loblaws";
import { Address, CompanyName } from "./global";
import { getPricesMetro } from "./metro";

const argv = yargs(process.argv.slice(2))
    .options({
        province: { type: "string", demandOption: true },
        metro: { type: "boolean", demand: false, default: false },
        loblaws: { type: "boolean", demand: false, default: false },
    })
    .parseSync();

const filterByStore = (array: Address[], company: CompanyName): Address[] => {
    return array.filter((store) => store.company === company);
};

async function scrapePrices() {
    const province = argv.province;

    const { stores } = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../",
                "../",
                "../",
                "src",
                "config",
                province,
                "stores.json"
            ),
            "utf-8"
        )
    );

    const { items } = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../",
                "../",
                "../",
                "src",
                "config",
                "items.json"
            ),
            "utf-8"
        )
    );

    if (argv.loblaws) {
        await getPricesLoblaws(items, filterByStore(stores, "Loblaws"));
    } else if (argv.metro) {
        await getPricesMetro(items, filterByStore(stores, "Metro"));
    } else {
        await getPricesLoblaws(items, filterByStore(stores, "Loblaws"));
        await getPricesMetro(items, filterByStore(stores, "Metro"));
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
