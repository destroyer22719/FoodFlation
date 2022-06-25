import puppeteer from "puppeteer";
import sequelize from "../src/db.js";
import Price from "../../backend/src/model/Price.js";
import Item from "../../backend/src/model/Item.js";
import Store from "../../backend/src/model/Store.js";
import { v4 as uuidv4 } from "uuid";
import Company from "../../backend/src/model/Company.js";
import { Address } from "../src/global.js";

export async function getPricesLoblaws(items: string[], stores: Address[]) {
    console.log(new Date());
    console.log("Starting scraping for Lablaws...");
    console.time("Scraping Lablaws");

    await sequelize.sync();
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    //disables location
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://www.loblaws.ca/store-locator?", [
        "geolocation",
    ]);

    //searches up store postal code directly and set the store location

    for (const store of stores) {
        const { city, postalCode, street } = store;

        await page.goto(
            `https://www.loblaws.ca/store-locator?searchQuery=${
                postalCode.split(" ")[0]
            }%20${postalCode.split(" ")[1]}`
        );

        await page.waitForSelector(".location-set-store__button:first-of-type");
        await page.click(".location-set-store__button:first-of-type");
        await page.waitForSelector(
            ".fulfillment-location-confirmation__actions__button"
        );
        await page.click(".fulfillment-location-confirmation__actions__button");

        for (const item of items) {
            //searches up the price of each item
            console.time(`Scraping for ${item} at ${postalCode}`);
            console.log(`${item} | ${postalCode} | ${items.indexOf(item)}-${stores.map(store => store.postalCode).indexOf(postalCode)} | ${new Date()}`);

            await page.goto(
                `https://www.loblaws.ca/search?search-bar=${item.replace(
                    " ",
                    "%20"
                )}`
            );

            try {
                await page.waitForSelector(".product-tile", {timeout: 30000});
            } catch (err) {
                continue;
            }

            //retrieves the value of the first 3 items
            const results = await page.evaluate(() => {
                const results = [];

                const name = document.getElementsByClassName(
                    "product-name__item product-name__item--name"
                );
                const price = document.querySelectorAll(
                    ".price__value.selling-price-list__item__price.selling-price-list__item__price--now-price.selling-price-list__item__price--__value"
                );
                const img = document.querySelectorAll(
                    ".product-tile__thumbnail__image > img"
                );

                //finds a maximum of 3 of each item
                const totalIters = name.length > 3 ? 3 : name.length;

                for (let i = 0; i < totalIters; i++) {
                    results.push({
                        name: (<HTMLElement>name[i]).innerText,
                        price: (<HTMLElement>price[i]).innerText,
                        imgUrl: (<HTMLImageElement>img[i]).src,
                    });
                }

                return results;
            });

            //inserts information to database
            let company = await Company.findOne({ where: { name: "Loblaws" } });

            if (!company) {
                company = new Company({ id: uuidv4(), name: "Loblaws" });
                await company.save();
            }

            let store = await Store.findOne({
                where: { postalCode, companyId: company.id },
            });
            if (!store) {
                store = new Store({
                    id: uuidv4(),
                    name: "Loblaws",
                    street,
                    city,
                    postalCode,
                    companyId: company.id,
                });

                await store.save();
            }

            for (const result of results) {
                console.log(`${result.name} - ${result.price}`);
                let itemObj = await Item.findOne({
                    where: { name: result.name, storeId: store.id },
                });

                if (!itemObj) {
                    itemObj = new Item({
                        id: uuidv4(),
                        name: result.name,
                        storeId: store.id,
                        imgUrl: result.imgUrl,
                    });

                    await itemObj.save();
                }

                const itemPrice = new Price({
                    id: uuidv4(),
                    price: parseFloat(result.price.slice(1)),
                    itemId: itemObj.id,
                });

                await itemPrice.save();
            }

            console.timeEnd(`Scraping for ${item} at ${postalCode}`);
        }
    }

    console.log("Finished scraping for Lablaws");
    console.timeEnd("Scraping Lablaws");
    console.log(new Date());
    await browser.close();
}
