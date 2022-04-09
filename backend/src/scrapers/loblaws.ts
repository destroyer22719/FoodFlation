import puppeteer from "puppeteer";
import sequelize from "../config/db.js";
import Price from "../model/Price.js";
import Item from "../model/Item.js";
import Store from "../model/Store.js";
import { v4 as uuidv4 } from "uuid";
import Company from "../model/Company.js";

export async function getPricesLoblaws(items: string[], stores: Address[]) {
    console.log("Starting scraping for Lablaws...");
    console.time("Scraping Lablaws");

    await sequelize.sync();
    const browser = await puppeteer.launch({
        headless: true,
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
            console.log(`${item} | ${postalCode} | ${new Date()}`);

            await page.goto(
                `https://www.loblaws.ca/search?search-bar=${item.replace(
                    " ",
                    "%20"
                )}`
            );

            await page.waitForSelector(".product-tile");

            //retrieves the value of first item
            const data = await page.evaluate(() => {
                const name = document.getElementsByClassName(
                    "product-name__item product-name__item--name"
                )[0];
                const price = document.querySelector(
                    ".price__value.selling-price-list__item__price.selling-price-list__item__price--now-price.selling-price-list__item__price--__value"
                );
                const img = document.querySelector(
                    ".product-tile__thumbnail__image > img"
                );

                return {
                    name: (<HTMLElement>name).innerText,
                    price: (<HTMLElement>price).innerText,
                    imgUrl: (<HTMLImageElement>img).src,
                };
            });

            //inserts information to database
            let company = await Company.findOne({ where: { name: "Loblaws" } });

            if (!company) {
                company = new Company({ id: uuidv4(), name: "Loblaws" });
                await company.save();
            }

            let store = await Store.findOne({ where: { postalCode } });
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

            let itemObj = await Item.findOne({ where: { name: data.name } });

            if (!itemObj) {
                itemObj = new Item({
                    id: uuidv4(),
                    name: data.name,
                    storeId: store.id,
                    imgUrl: data.imgUrl,
                });

                await itemObj.save();
            }

            const itemPrice = new Price({
                id: uuidv4(),
                price: parseFloat(data.price.slice(1)),
                itemId: itemObj.id,
            });

            await itemPrice.save();
            console.timeEnd(`Scraping for ${item} at ${postalCode}`);
        }
    }

    console.log("Finished scraping for Lablaws");
    console.timeEnd("Scraping Lablaws");
    await browser.close();
}
