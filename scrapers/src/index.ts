import fs from "fs";
import path from "path";
import yargs from "yargs/yargs";
import { getPricesLoblaws } from "./loblaws.js";
import { Address, CompanyName, Province } from "./global.js";
import { getPricesMetro } from "./metro.js";

const __dirname = path.resolve();

const argv = yargs(process.argv.slice(2))
    .options({
        province: { type: "string", demandOption: false },
        metro: { type: "boolean", demand: false, default: false },
        loblaws: { type: "boolean", demand: false, default: false },
        storeStart: { type: "number", demand: false, default: 0 },
        itemStart: { type: "number", demand: false, default: 0 },
        all: { type: "boolean", demand: false, default: false },
    })
    .parseSync();

export const filterByStore = (
    array: Address[],
    company: CompanyName
): Address[] => {
    return array.filter((store) => store.company === company);
};

export const msToTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

async function scrapeAll() {
    let provinces: Province[] = [
        "alberta",
        "british_columbia",
        "ontario",
        "quebec",
    ];

    provinces = provinces.slice(
        argv.province ? provinces.indexOf(argv.province as Province) : 0
    );

    for (const province of provinces) {
        console.log(province);

        const { stores } = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "src", "config", "canada", `${province}.json`),
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
                filterByStore(stores, "Loblaws"),
                argv.storeStart,
                argv.itemStart
            );
        } else if (argv.metro) {
            await getPricesMetro(
                items,
                filterByStore(stores, "Metro"),
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
}

async function scrapeByProv() {
    if (!argv.province) {
        throw new Error("Province not specified");
    }

    const province: Province = argv.province as Province;
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
            filterByStore(stores, "Loblaws"),
            argv.storeStart,
            argv.itemStart
        );
    } else if (argv.metro) {
        await getPricesMetro(
            items,
            filterByStore(stores, "Metro"),
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
    if (argv.all) {
        await scrapeAll();
        return;
    }

    await scrapeByProv();
    setInterval(() => {
        (async () => {
            await scrapeByProv();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
