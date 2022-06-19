import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./loblaws";
import { Address, CompanyName } from "../global";
import { getPricesMetro } from "./metro";

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


    await getPricesLoblaws(items, filterByStore(stores, "Loblaws"));
    await getPricesMetro(items, filterByStore(stores, "Metro"));

}
(async () => {
    await scrapePrices();
    setInterval(() => {
        (async () => {
            await scrapePrices();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
