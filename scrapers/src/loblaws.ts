import puppeteer from "puppeteer";
import sequelize from "../src/db.js";
import { v4 as uuidv4 } from "uuid";
import cliProgress from "cli-progress";
import ora from "ora";
import colors from "ansi-colors";
import Price from "../../backend/src/model/Price.js";
import Item from "../../backend/src/model/Item.js";
import Store from "../../backend/src/model/Store.js";
import Company from "../../backend/src/model/Company.js";
import { Address } from "../src/global.js";
import {  msToTime } from "./index.js";

export async function getPricesLoblaws(
    itemsArray: string[],
    storesArray: Address[],
    storeStart: number = 1,
    itemStart: number = 1
) {
    const stores = storesArray.slice(storeStart - 1);
    if (stores.length === 0) {
        console.log("No Loblaws stores found");
        return;
    }

    const startTime = Date.now();

    await sequelize.sync();
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    //disables location
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://www.loblaws.ca/store-locator?", [
        "geolocation",
    ]);

    let items = itemsArray.slice(itemStart - 1);

    const multiBar = new cliProgress.MultiBar(
        {
            clearOnComplete: false,
            hideCursor: true,
        },
        cliProgress.Presets.shades_grey
    );

    const storeBar = multiBar.create(
        storesArray.length,
        storeStart - 1,
        {},
        {
            format:
                "Loblaws |" +
                colors.cyan("{bar}") +
                "| {percentage}% | {value}/{total} Stores",
            hideCursor: true,
        }
    );

    const itemBar = multiBar.create(
        itemsArray.length,
        itemStart - 1,
        {},
        {
            format:
                "Items   |" +
                colors.magenta("{bar}") +
                "| {percentage}% | {value}/{total} Items",
            hideCursor: true,
        }
    );

    //this is a cheap workaround for combining multiple bars with ora spinners
    multiBar.create(0, 0);

    const loader = ora("Scraping Loblaws...").start();

    for (const store of stores) {
        //searches up store postal code directly and set the store location
        const { city, postalCode, street } = store;
        loader.color = "green";
        loader.text = `Scraping ${postalCode}...`;
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
            loader.color = "green";
            loader.text = `${itemsArray.indexOf(item)}/${
                itemsArray.length - 1
            } - ${storesArray
                .map((store) => store.postalCode)
                .indexOf(postalCode)}/${
                storesArray.length - 1
            }| ${item} at ${postalCode}`;
            await page.goto(
                `https://www.loblaws.ca/search?search-bar=${item.replace(
                    " ",
                    "%20"
                )}`
            );

            try {
                await page.waitForSelector(".product-tile", { timeout: 30000 });
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
                    ".selling-price-list__item__price--now-price__value"
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
                loader.text = `${itemsArray.indexOf(item)}/${
                    itemsArray.length - 1
                } - ${storesArray
                    .map((store) => store.postalCode)
                    .indexOf(postalCode)}/${
                    storesArray.length - 1
                }|${item} at ${postalCode} |(${result.name} for ${
                    result.price
                })`;

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
            itemBar.increment(1);
        }
        items = itemsArray;
        storeBar.increment(1);
        itemBar.update(0);
    }
    itemBar.update(itemsArray.length);
    storeBar.stop();
    itemBar.stop();
    multiBar.stop();
    loader.stop();

    await browser.close();

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    console.log(msToTime(timeTaken));
}
