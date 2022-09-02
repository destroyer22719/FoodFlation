import { Address, CompanyName, Province, State } from "./global";
import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./stores/loblaws.js";
import { getPricesMetro } from "./stores/metro.js";
import { getPricesWholeFoodsMarket } from "./stores/whole_foods_market.js";


const __dirname = path.resolve();

export async function scrapeCanada({
    province,
    itemStart = 0,
    storeStart = 0,
    metro = false,
    loblaws = false,
}: {
    province?: Province;
    itemStart: number;
    storeStart: number;
    metro?: boolean;
    loblaws?: boolean;
}) {
    const { items } = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "items.json"),
            "utf-8"
        )
    );

    let provinces: Province[] = province
        ? [province]
        : ["alberta", "british_columbia", "ontario", "quebec"];

    for (const prov of provinces) {
        console.log(prov);

        const { stores } = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "src", "config", "canada", `${prov}.json`),
                "utf-8"
            )
        );

        storeScrape(items, stores, { itemStart, storeStart, metro, loblaws });
    }
}

export async function scrapeAmerica({
    state,
    itemStart,
    storeStart,
    wholeFoodsMarket = false,
}: {
    state?: State;
    wholeFoodsMarket?: boolean;
    itemStart: number;
    storeStart: number;
}) {
    const { items } = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "items.json"),
            "utf-8"
        )
    );

    let states: State[] = state ? [state] : ["new_york"];

    for (const st of states) {
        console.log(st);

        const { stores } = JSON.parse(
            fs.readFileSync(
                path.join(
                    __dirname,
                    "src",
                    "config",
                    "united_states",
                    `${st}.json`
                ),
                "utf-8"
            )
        );

        storeScrape(items, stores, { itemStart, storeStart, wholeFoodsMarket });
    }
}

export async function scrapeAll({
    province,
    state,
    itemStart = 0,
    storeStart = 0,
    loblaws = false,
    metro = false,
    wholeFoodsMarket = false,
}: {
    province?: string;
    state?: string;
    itemStart: number;
    storeStart: number;
    loblaws?: boolean;
    metro?: boolean;
    wholeFoodsMarket?: boolean;
}) {
    const { items } = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "src", "config", "items.json"),
            "utf-8"
        )
    );

    let provinces: Province[] = [
        "alberta",
        "british_columbia",
        "ontario",
        "quebec",
    ];

    let states: State[] = ["new_york"];

    provinces = provinces.slice(
        province ? provinces.indexOf(province as Province) : 0
    );

    states = states.slice(state ? states.indexOf(state as State) : 0);

    for (const prov of provinces) {
        console.log(prov);

        const { stores } = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "src", "config", "canada", `${prov}.json`),
                "utf-8"
            )
        );

        storeScrape(items, stores, {
            itemStart,
            storeStart,
            loblaws,
            metro,
        });
    }

    for (const st of states) {
        console.log(st);

        const { stores } = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "src", "config", "usa", `${st}.json`),
                "utf-8"
            )
        );

        storeScrape(items, stores, {
            itemStart,
            storeStart,
            wholeFoodsMarket,
        });
    }
}

const storeScrape = async (
    items: string[],
    stores: Address[],
    {
        loblaws,
        metro,
        wholeFoodsMarket,
        storeStart = 0,
        itemStart = 0,
    }: {
        loblaws?: boolean;
        metro?: boolean;
        wholeFoodsMarket?: boolean;
        storeStart?: number;
        itemStart?: number;
    }
) => {
    if (loblaws) {
        await getPricesLoblaws(
            items,
            filterByStore(stores, "Loblaws"),
            storeStart,
            itemStart
        );
    } else if (metro) {
        await getPricesMetro(
            items,
            filterByStore(stores, "Metro"),
            storeStart,
            itemStart
        );
    } else if (wholeFoodsMarket) {
        await getPricesWholeFoodsMarket(
            items,
            filterByStore(stores, "Whole Foods Market"),
            storeStart,
            itemStart
        );
    } else {
        await getPricesLoblaws(
            items,
            filterByStore(stores, "Loblaws"),
            storeStart,
            itemStart
        );
        await getPricesMetro(
            items,
            filterByStore(stores, "Metro"),
            storeStart,
            itemStart
        );
        await getPricesWholeFoodsMarket(
            items,
            filterByStore(stores, "Whole Foods Market"),
            storeStart,
            itemStart
        );
    }
};

const filterByStore = (array: Address[], company: CompanyName): Address[] => {
    return array.filter((store) => store.company === company);
};

export const msToTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}