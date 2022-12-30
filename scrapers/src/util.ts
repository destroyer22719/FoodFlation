import {
  Address,
  AmericanStoresOptions,
  CanadianStoresOptions,
  CompanyName,
  Province,
  State,
  StoresOptions,
} from "./global";
import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./stores/loblaws.js";
import { getPricesMetro } from "./stores/metro.js";
import { getPricesWholeFoodsMarket } from "./stores/whole_foods_market.js";
import { getPricesAldi } from "./stores/aldi.js";
import { getPricesNoFrills } from "./stores/nofrills.js";
import { getPricesTarget } from "./stores/target.js";

const __dirname = path.resolve();

export async function scrapeCanada(
  province: Province,
  itemStart: number = 0,
  storeStart: number = 0,
  storesOptions: CanadianStoresOptions
) {
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

    await storeScrape(items, stores, itemStart, storeStart, storesOptions);
  }
}

export async function scrapeAmerica(
  state: State,
  itemStart: number = 0,
  storeStart: number = 0,
  storesOptions: AmericanStoresOptions
) {
  const { items } = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "config", "items.json"),
      "utf-8"
    )
  );

  let states: State[] = state
    ? [state]
    : ["new_york", "california", "texas", "michigan"];

  for (const st of states) {
    console.log(st);

    const { stores } = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "src", "config", "united_states", `${st}.json`),
        "utf-8"
      )
    );

    await storeScrape(items, stores, itemStart, storeStart, storesOptions);
  }
}

export async function scrapeAll(
  province: Province,
  state: State,
  itemStart: number = 0,
  storeStart: number = 0,
  storesOptions: StoresOptions
) {
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

  let states: State[] = ["new_york", "california", "texas", "michigan"];

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

    await storeScrape(items, stores, itemStart, storeStart, storesOptions);
  }

  for (const st of states) {
    console.log(st);

    const { stores } = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "src", "config", "united_states", `${st}.json`),
        "utf-8"
      )
    );

    await storeScrape(items, stores, itemStart, storeStart, storesOptions);
  }
}

const storeScrape = async (
  items: string[],
  stores: Address[],
  storeStart: number = 0,
  itemStart: number = 0,
  storesOptions: StoresOptions
) => {
  const { aldi, loblaws, metro, noFrills, wholeFoodsMarket, target } =
    storesOptions;

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
  } else if (noFrills) {
    await getPricesNoFrills(
      items,
      filterByStore(stores, "No Frills"),
      storeStart,
      itemStart
    );
  } else if (target) {
    await getPricesTarget(
      items,
      filterByStore(stores, "Target"),
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
  } else if (aldi) {
    await getPricesAldi(
      items,
      filterByStore(stores, "Aldi"),
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
    await getPricesNoFrills(
      items,
      filterByStore(stores, "No Frills"),
      storeStart,
      itemStart
    );
    await getPricesWholeFoodsMarket(
      items,
      filterByStore(stores, "Whole Foods Market"),
      storeStart,
      itemStart
    );
    await getPricesAldi(
      items,
      filterByStore(stores, "Aldi"),
      storeStart,
      itemStart
    );
    await getPricesTarget(
      items,
      filterByStore(stores, "Target"),
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
};
