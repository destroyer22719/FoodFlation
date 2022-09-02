import puppeteer from "puppeteer";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import sequelize from "../db.js";
import Price from "../../../backend/src/model/Price.js";
import Item from "../../../backend/src/model/Item.js";
import Store from "../../../backend/src/model/Store.js";
import Company from "../../../backend/src/model/Company.js";
import { Address } from "../global.js";
import { msToTime } from "../util.js";

const __dirname = path.resolve();

export async function getPricesWholeFoodsMarket(
    itemsArray: string[],
    storesArray: Address[],
    storeStart: number = 0,
    itemStart: number = 0
) {
    const stores = storesArray.slice(storeStart);

    if (stores.length === 0) {
        console.log("No Whole Foods Market stores found");
        return;
    }

    let items = itemsArray.slice(itemStart);

    const startTime = Date.now();

    await sequelize.sync();

    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    //disables location
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(
        "https://www.wholefoodsmarket.com/stores",
        ["geolocation"]
    );

    const multiBar = new cliProgress.MultiBar(
        {
            clearOnComplete: false,
            hideCursor: true,
        },
        cliProgress.Presets.shades_grey
    );

    const storeBar = multiBar.create(
        storesArray.length,
        storeStart,
        {},
        {
            format:
                "Whole Foods Market |" +
                colors.cyan("{bar}") +
                "| {percentage}% | {value}/{total} Stores",
            hideCursor: true,
        }
    );

    const itemBar = multiBar.create(
        itemsArray.length,
        itemStart,
        {},
        {
            format:
                "Items              |" +
                colors.magenta("{bar}") +
                "| {percentage}% | {value}/{total} Items",
            hideCursor: true,
        }
    );

    //this is a cheap workaround for combining multiple bars with ora spinners
    multiBar.create(0, 0);

    const loader = ora("Scraping Whole Foods Market...").start();

    const item2category = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "item2category.json"),
            "utf-8"
        )
    );

    for (const store of stores) {
        let { city, zipCode, state, country, street } = store;

        state = state as string;
        zipCode = zipCode as string;
        country = country as string;

        loader.color = "green";
        loader.text = `Scraping ${zipCode}...`;
        await page.goto("https://www.wholefoodsmarket.com/stores", {
            waitUntil: "domcontentloaded",
        });

        await page.waitForSelector("#store-finder-search-bar");
        const zipInput = await page.$("#store-finder-search-bar");

        await zipInput?.type(zipCode);
        await zipInput?.press("Enter");

        
        //clicking on the right store
        await page.waitForTimeout(2500);
        await page.waitForSelector(
            "wfm-store-list li:nth-child(1) wfm-store-selector > span",
            {
                visible: true,
                timeout: 5000,
            }
        );

        await page.click(
            "wfm-store-list li:nth-child(1) wfm-store-selector > span"
        );

        await page.waitForSelector(".w-mystore");

        for (const item of items) {
            loader.color = "green";
            loader.text = `${itemsArray.indexOf(item)}/${
                itemsArray.length
            } - ${storesArray
                .map((store) => store.zipCode)
                .indexOf(zipCode)}/${
                storesArray.length
            }| ${item} at ${zipCode}`;

            await page.goto(
                `https://www.wholefoodsmarket.com/search?text=${item}`, {
                    waitUntil: "domcontentloaded",    
                }
            );
            
            if (await page.$(`img[alt="No results found"`)) continue;

            await page.waitForSelector(".w-pie--product-tile__image", {
                visible: true,
                timeout: 15000,
            });

            const results = await page.evaluate(() => {
                const prices = Array.from(
                    document.querySelectorAll(".regular_price > b")
                )
                    .map((e) => parseFloat((e as HTMLElement).innerText.slice(1)))
                    .slice(0, 3);

                const names = Array.from(
                    document.querySelectorAll(
                        `h2[data-testid="product-tile-name"]`
                    )
                )
                    .map((e) => (e as HTMLElement).innerText)
                    .slice(0, 3);

                const images = Array.from(
                    document.querySelectorAll(
                        `img[data-testid="product-tile-image"]`
                    )
                )
                    .map((e) => (e as HTMLImageElement).src)
                    .slice(0, 3);

                const resultData = [];
                const resultLength = Math.min(prices.length, names.length, images.length);

                for (let i = 0; i < resultLength; i++) {
                    resultData.push({
                        name: names[i],
                        price: prices[i],
                        image: images[i],
                    });
                }

                return resultData;
            });

            //inserts information to database
            let company = await Company.findOne({
                where: { name: "Whole Foods Market" },
            });

            if (!company) {
                company = new Company({
                    id: uuidv4(),
                    name: "Whole Foods Market",
                });
                await company.save();
            }

            let store = await Store.findOne({
                where: { zipCode, companyId: company.id },
            });
            if (!store) {
                store = new Store({
                    id: uuidv4(),
                    name: "Whole Foods Market",
                    street,
                    city,
                    state,
                    country,
                    zipCode,
                    companyId: company.id,
                });

                await store.save();
            }

            for (const result of results) {
                loader.text = `${itemsArray.indexOf(item)}/${
                    itemsArray.length
                } - ${storesArray
                    .map((store) => store.zipCode)
                    .indexOf(zipCode)}/${
                    storesArray.length
                }|${item} at ${zipCode} |(${result.name} for ${result.price})`;

                let itemObj = await Item.findOne({
                    where: { name: result.name, storeId: store.id },
                });

                if (!itemObj) {
                    itemObj = new Item({
                        id: uuidv4(),
                        name: result.name,
                        storeId: store.id,
                        imgUrl: result.image,
                    });

                    await itemObj.save();
                } else if (itemObj.category !== item2category[item]) {
                    itemObj.category = item2category[item];
                    await itemObj.save();
                }

                const itemPrice = new Price({
                    id: uuidv4(),
                    price: result.price,
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
