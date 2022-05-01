import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./loblaws";

async function scrapeAll() {
    const data = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../", "../", "scraper.json"),
            "utf-8"
        )
    );

    try {
        await getPricesLoblaws(data.loblaws.items, data.loblaws.stores);
    } catch (err) {
        console.log(err);
    }
}
(async () => {
    await scrapeAll();
    setInterval(() => {
        (async () => {
            await scrapeAll();
        })();
    }, 1000 * 60 * 60 * 24); //24 hours
})();
