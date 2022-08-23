import puppeteer from "puppeteer";
import ora from "ora";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import sequelize from "./db.js";
import Price from "../../backend/src/model/Price.js";
import Item from "../../backend/src/model/Item.js";
import Store from "../../backend/src/model/Store.js";
import Company from "../../backend/src/model/Company.js";
import { Address } from "src/global.js";
import { msToTime } from "./index.js";

export async function getPricesMetro(
    itemsArray: string[],
    storesArray: Address[],
    storeStart: number = 0,
    itemStart: number = 0
) {
    const stores = storesArray.slice(storeStart);

    if (stores.length === 0) {
        console.log("No Metro stores found");
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
    await context.overridePermissions("https://www.Metro.ca/cp/grocery", [
        "geolocation",
    ]);

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
                "Metro |" +
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
                "Items |" +
                colors.magenta("{bar}") +
                "| {percentage}% | {value}/{total} Items",
            hideCursor: true,
        }
    );

    //this is a cheap workaround for combining multiple bars with ora spinners
    multiBar.create(0, 0);

    const loader = ora("Scraping Loblaws...").start();

    const item2category = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "item2category.json"),
            "utf-8"
        )
    );

    for (const store of stores) {
        //searches up store postal code directly and set the store location
        const { city, postalCode, street } = store;
        loader.color = "green";
        loader.text = `Scraping ${postalCode}...`;
        await page.goto("https://www.metro.ca/en/find-a-grocery");

        await page.$eval(
            "#postalCode",
            (input, pc) => ((input as HTMLInputElement).value = pc as string),
            postalCode
        );
        await page.click("#submit");
        await page.waitForTimeout(5000);
        await page.click(
            "#mapResults > li:nth-child(1) > div.white-wrapper > div > div.row.no-gutters.justify-content-between.align-items-center > div:nth-child(1) > button"
        );
        await page.waitForNavigation();
        for (const item of items) {
            //searches up the price of each item
            loader.color = "green";
            loader.text = `${itemsArray.indexOf(item)}/${
                itemsArray.length
            } - ${storesArray
                .map((store) => store.postalCode)
                .indexOf(postalCode)}/${
                storesArray.length
            }| ${item} at ${postalCode}`;
            await page.goto(`https://www.metro.ca/en/search?filter=${item}`, {
                waitUntil: "domcontentloaded",
            });

            await page.waitForTimeout(2000);
            const popup = await page.$(
                ".p__close.closeModalLogIn.removeBodyOverFlow"
            );
            if (popup) await popup.evaluate((b) => (b as HTMLElement).click());
            try {
                await page.waitForSelector(
                    ".tile-product__top-section__details",
                    { timeout: 15000 }
                );
            } catch (err) {
                continue;
            }

            //retrieves the value of the first 3 items
            const results = await page.evaluate(() => {
                const results = [];
                const priceRegex = /(?<=\$)\d*.\d{2}/;
                const name = document.querySelectorAll(
                    ".tile-product__top-section__details > a > div"
                );
                const price = document.querySelectorAll(".pi--main-price");
                const prodTile = document.querySelectorAll(
                    ".products-tile-list__tile"
                );
                const img = document.querySelectorAll(
                    ".tile-product__top-section__visuals__img-product.defaultable-picture > img"
                );

                //finds a maximum of 3 of each item
                const totalIters = name.length > 3 ? 3 : name.length;
                for (let i = 0; i < totalIters; i++) {
                    //somes the prices on metro listes as "2 / $9.99" with "or 6.99 ea", this code will get the price of each items
                    // please Metro can the prices on your website be consistently and displayed in a uniform manner T_T
                    let priceText = (<HTMLElement>(
                        price[i].querySelector(
                            ":scope .pi-sale-price:first-child"
                        )
                    )).innerText;
                    let priceElem: HTMLElement;

                    if (priceText.match(/^\s*(?<!\$)[a-z0-9\s\.]+\//)) {
                        priceElem = <HTMLElement>(
                            price[i].querySelector(
                                ":scope .pi-secondary-price>div"
                            )
                        );
                        if (priceElem)
                            priceText =
                                priceElem.innerText.match(priceRegex)![0];
                        else if (
                            <HTMLElement>(
                                prodTile[i].querySelector(
                                    ":scope .pi-regular-price > .pi-price"
                                )
                            )
                        ) {
                            priceText = (<HTMLElement>(
                                prodTile[i].querySelector(
                                    ":scope .pi-regular-price > .pi-price"
                                )
                            )).innerText.match(priceRegex)![0];
                        } else if (
                            <HTMLElement>(
                                prodTile[i].querySelector(
                                    ":scope .pi-secondary-price > .pi-price"
                                )
                            )
                        ) {
                            priceText = (<HTMLElement>(
                                prodTile[i].querySelector(
                                    ":scope .pi-secondary-price > .pi-price"
                                )
                            )).innerText.match(priceRegex)![0];
                        }
                    } else {
                        priceText = (<HTMLElement>price[i]).innerText.match(
                            priceRegex
                        )![0];
                    }

                    results.push({
                        name: (<HTMLElement>name[i]).innerText,
                        price: priceText,
                        imgUrl: (<HTMLImageElement>img[i]).src,
                    });
                }

                return results;
            });
            //inserts information to database
            let company = await Company.findOne({ where: { name: "Metro" } });

            if (!company) {
                company = new Company({ id: uuidv4(), name: "Metro" });
                await company.save();
            }

            let store = await Store.findOne({
                where: { postalCode, companyId: company.id },
            });
            if (!store) {
                store = new Store({
                    id: uuidv4(),
                    name: "Metro",
                    street,
                    city,
                    postalCode,
                    companyId: company.id,
                });

                await store.save();
            }

            for (const result of results) {
                loader.text = `${itemsArray.indexOf(item)}/${
                    itemsArray.length
                } - ${storesArray
                    .map((store) => store.postalCode)
                    .indexOf(postalCode)}/${
                    storesArray.length
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
                } else if (
                    itemObj.category !== item2category[item]
                ) {
                    itemObj.category = item2category[item];
                    console.log(item2category[item])
                    await itemObj.save();
                }

                const itemPrice = new Price({
                    id: uuidv4(),
                    price: parseFloat(result.price),
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

// getPricesMetro(["eggs"], [{city: "", street: "",postalCode: "M1P 5B7"}]);
