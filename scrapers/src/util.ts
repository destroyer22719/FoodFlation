import {
  Address,
  AmericanStoresOptions,
  CanadianStoresOptions,
  CompanyName,
  Province,
  State,
  StoreConfig,
  StoreIndex,
  StoreLists,
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

export function generateStoresToScrape(
  storeIndex: StoreIndex,
  storeConfig: StoreConfig
): StoreLists {
  let totalStores = 0;

  let {
    province,
    state,
    itemStart,
    storeStart,
    americanStoreOptions,
    canadianStoreOptions,
  } = storeConfig;

  const storeList: StoreLists = {
    us: {
      new_york: [],
      california: [],
      texas: [],
      michigan: [],
    },
    canada: {
      alberta: [],
      british_columbia: [],
      ontario: [],
      quebec: [],
    },
    firstItems: [],
    items: [],
  };

  let result = [];

  const { items } = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "config", "items.json"),
      "utf-8"
    )
  );

  storeList.items = items;
  storeList.firstItems = items.slice(itemStart);

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
  for (const prov of provinces) {
    let { stores } = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "src", "config", "canada", `${prov}.json`),
        "utf-8"
      )
    );

    if (canadianStoreOptions && !americanStoreOptions) {
      const { metro, loblaws, noFrills } = canadianStoreOptions;
      if (metro) {
        stores = filterByStore(stores, "Metro");
      } else if (loblaws) {
        stores = filterByStore(stores, "Loblaws");
      } else if (noFrills) {
        stores = filterByStore(stores, "No Frills");
      }
    }

    if (storeStart > 0) {
      const newStores = stores.slice(
        storeStart > stores.length ? stores.length : storeStart
      );
      result = newStores;
      storeStart -= stores.length;
      totalStores += newStores.length;
    } else {
      result = stores;
      totalStores += stores.length;
    }

    storeList.canada[prov] = result;
  }

  states = states.slice(state ? states.indexOf(state as State) : 0);

  for (const st of states) {
    let { stores } = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "src", "config", "united_states", `${st}.json`),
        "utf-8"
      )
    );
    if (americanStoreOptions && !canadianStoreOptions) {
      const { aldi, target, wholeFoodsMarket } = americanStoreOptions;

      if (aldi) {
        stores = filterByStore(stores, "Aldi");
      } else if (target) {
        stores = filterByStore(stores, "Target");
      } else if (wholeFoodsMarket) {
        stores = filterByStore(stores, "Whole Foods Market");
      }
    }
    if (storeStart > 0) {
      const newStores = stores.slice(storeStart);
      result = newStores;
      storeStart -= stores.length;
      totalStores += newStores.length;
    } else {
      result = stores;
      totalStores += stores.length;
    }

    storeList.us[st] = result;
  }

  storeIndex.itemTotal = itemStart
    ? items.length - itemStart + items.length * totalStores - 1
    : items.length * totalStores;
  storeIndex.storeTotal = totalStores;
  return storeList;
}

export async function scrapeStores(
  storeList: StoreLists,
  storeIndex: StoreIndex
) {
  const { canada, us, items, firstItems } = storeList;

  let currentItemList = firstItems || items;
  const stores = [
    ...canada.alberta,
    ...canada.british_columbia,
    ...canada.ontario,
    ...canada.quebec,
    ...us.new_york,
    ...us.california,
    ...us.texas,
    ...us.michigan,
  ];
  const loblawsStores = stores.filter((store) => store.company === "Loblaws");
  const metroStores = stores.filter((store) => store.company === "Metro");
  const noFrillsStores = stores.filter(
    (store) => store.company === "No Frills"
  );
  const wholeFoodsMarketStores = stores.filter(
    (store) => store.company === "Whole Foods Market"
  );
  const aldiStores = stores.filter((store) => store.company === "Aldi");

  if (loblawsStores.length) {
    await getPricesLoblaws(loblawsStores, storeIndex, currentItemList);
  } else if (aldiStores.length) {
    await getPricesAldi(aldiStores, storeIndex, currentItemList, firstItems);
  }
}

function filterByStore(array: Address[], company: CompanyName): Address[] {
  return array.filter((store) => store.company === company);
}

export const msToTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const defaultItems = [
  "eggs",
  "milk",
  "butter",
  "flour",
  "bacon",
  "pork",
  "beef",
  "ground beef",
  "chicken breasts",
  "chicken wings",
  "tomatoes",
  "cheese",
  "bananas",
  "lettuce",
  "onions",
  "broccoli",
  "rice",
  "cooking oil",
  "salmon",
  "tuna",
  "cucumbers",
  "potatoes",
  "bread",
  "cereal",
  "beets",
  "radish",
  "mushrooms",
  "watermelons",
  "garlic",
  "ham",
  "sausages",
  "turkey",
];
