import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./loblaws";
import { Address, CompanyName } from "../global";
import { getPricesMetro } from "./metro";

const itemStart = +process.argv[3].split("=")[1] || 0;
const storeStart = +process.argv[4].split("=")[1] || 0;

const filterByStore = (array: Address[], company: CompanyName):Address[] => {
    return array.filter(store => store.company === company);
};

async function scrapePrices() {
    const province = process.argv[2].split("=")[1];

    const {stores} = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../", "../", "src", "scrapers", "config", province, "stores.json"),
            "utf-8"
        )
    );
    
    const {items} = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../", "../", "src", "scrapers", "config", "items.json"),
            "utf-8"
        )
    );

    await getPricesLoblaws(items.slice(itemStart), filterByStore(stores, "Loblaws").slice(storeStart));
    await getPricesMetro(items.slice(itemStart), filterByStore(stores, "Metro").slice(storeStart));
}

(async () => {
    await scrapePrices();
    setInterval(() => {
        (async () => {
            await scrapePrices();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
