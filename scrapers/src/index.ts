import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./loblaws";
import { Address, CompanyName } from "./global";
import { getPricesMetro } from "./metro";

let itemStart = 0;
let storeStart = 0;

if (process.argv[3]) {
    itemStart = parseInt(process.argv[3].split("=")[1]);
}
if (process.argv[4]) {
    storeStart = parseInt(process.argv[4].split("=")[1]);
}

const filterByStore = (array: Address[], company: CompanyName):Address[] => {
    return array.filter(store => store.company === company);
};

async function scrapePrices() {
    const province = process.argv[2].split("=")[1];

    const {stores} = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../", "../", "../", "src", "config", province, "stores.json"),
            "utf-8"
        )
    );
    
    const {items} = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../", "../", "../", "src", "config", "items.json"),
            "utf-8"
        )
    );

    await getPricesLoblaws(items.slice(itemStart), filterByStore(stores.slice(storeStart), "Loblaws"));
    await getPricesMetro(items.slice(itemStart), filterByStore(stores.slice(storeStart), "Metro"));
    
    //we only want to start at a specific item and store once, after that we can start at the beginning
    itemStart = 0;
    storeStart = 0;
}

(async () => {
    await scrapePrices();
    setInterval(() => {
        (async () => {
            await scrapePrices();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
