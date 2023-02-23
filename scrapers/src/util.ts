import {
  Address,
  CompanyName,
  Province,
  State,
  StoreConfig,
  StoreIndexes,
  StoreLists,
} from "./global";
import fs from "fs";
import path from "path";
import { getPricesLoblaws } from "./stores/loblaws.js";
import { getPricesMetro } from "./stores/metro.js";
import { getPricesWholeFoodsMarket } from "./stores/whole_foods_market.js";
import { getPricesAldi } from "./stores/aldi.js";
import { getPricesNoFrills } from "./stores/nofrills.js";

const __dirname = path.resolve();

export function generateStoresToScrape(
  storeIndexes: StoreIndexes,
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
    canadaOnly = false,
    usOnly = false,
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
    storeStart: 0,
  };

  const { items } = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "config", "items.json"),
      "utf-8"
    )
  );

  storeList.items = items;
  storeList.firstItems = items.slice(itemStart);

  let provinces: Province[] = province
    ? [province]
    : ["alberta", "british_columbia", "ontario", "quebec"];

  let states: State[] = state
    ? [state]
    : ["new_york", "california", "texas", "michigan"];

  if (!usOnly) {
    for (const prov of provinces) {
      let { stores } = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "src", "config", "canada", `${prov}.json`),
          "utf-8"
        )
      );

      let filteredStores: Address[] = [];
      if (canadianStoreOptions && !americanStoreOptions) {
        const { metro, loblaws, noFrills } = canadianStoreOptions;

        if (metro || loblaws || noFrills) {
          if (metro) {
            filteredStores = [
              ...filteredStores,
              ...filterByStore(stores, "Metro"),
            ];
          }
          if (loblaws) {
            filteredStores = [
              ...filteredStores,
              ...filterByStore(stores, "Loblaws"),
            ];
          }
          if (noFrills) {
            filteredStores = [
              ...filteredStores,
              ...filterByStore(stores, "No Frills"),
            ];
          }
        }
      }

      if (canadianStoreOptions && !americanStoreOptions) {
        stores = filteredStores;
      }

      totalStores += stores.length;
      storeList.canada[prov] = stores;
    }
  }

  if (!canadaOnly) {
    for (const st of states) {
      let { stores } = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "src", "config", "united_states", `${st}.json`),
          "utf-8"
        )
      );

      let filteredStores: Address[] = [];

      if (americanStoreOptions && !canadianStoreOptions) {
        const { aldi, target, wholeFoodsMarket } = americanStoreOptions;
        if (aldi || target || wholeFoodsMarket) {
          if (aldi) {
            filteredStores = [
              ...filteredStores,
              ...filterByStore(stores, "Aldi"),
            ];
          }
          if (target) {
            filteredStores = [
              ...filteredStores,
              ...filterByStore(stores, "Target"),
            ];
          }
          if (wholeFoodsMarket) {
            filteredStores = [
              ...stores,
              ...filterByStore(filteredStores, "Whole Foods Market"),
            ];
          }
        }
      }

      if (canadianStoreOptions && !americanStoreOptions) {
        stores = filteredStores;
      }

      totalStores += stores.length;
      storeList.us[st] = stores;
    }
  }

  storeIndexes.itemTotal = itemStart
    ? items.length - itemStart + items.length * totalStores - 1
    : items.length * totalStores;
  storeIndexes.storeTotal = totalStores;
  storeIndexes.storeIndex = storeStart || 0;
  return storeList;
}

export async function scrapeStores(
  storeList: StoreLists,
  storeIndexes: StoreIndexes
) {
  let { canada, us, items, firstItems, storeStart } = storeList;

  let currentItemList = firstItems || items;

  for (const prov in canada) {
    const stores: Address[] = canada[prov];
    const prevStoreStart = storeStart;

    if (!stores.length) continue;
    if (storeStart < storeIndexes.storeIndex && stores.length) {
      let min = Math.min(stores.length, storeIndexes.storeIndex - storeStart);
      storeStart += min;
      if (min === stores.length) continue;
    }

    let counter = new Counter(storeIndexes.storeIndex - prevStoreStart);
    let loblawsStores = filterByStore(stores, "Loblaws");
    let metroStores = filterByStore(stores, "Metro");
    let noFrillsStores = filterByStore(stores, "No Frills");

    loblawsStores = loblawsStores.slice(counter.count);
    metroStores = metroStores.slice(counter.count);
    noFrillsStores = noFrillsStores.slice(counter.count);

    console.log(`${prov}, Canada`);

    await getPricesLoblaws(
      loblawsStores,
      currentItemList,
      storeIndexes,
      counter.count
    );

    counter.subtract(loblawsStores.length);

    await getPricesMetro(
      metroStores,
      currentItemList,
      storeIndexes,
      counter.count
    );

    counter.subtract(metroStores.length);

    await getPricesNoFrills(
      noFrillsStores,
      currentItemList,
      storeIndexes,
      counter.count
    );
    counter.subtract(noFrillsStores.length);
  }

  for (const state in us) {
    const stores: Address[] = us[state];

    if (!stores.length) continue;
    if (storeStart < storeIndexes.storeIndex && stores.length) {
      let min = Math.min(stores.length, storeIndexes.storeIndex - storeStart);
      storeStart += min;
      if (min === stores.length) continue;
    }

    let counter = new Counter(storeIndexes.storeIndex - storeStart);
    let aldiStores = filterByStore(stores, "Aldi");
    let wholeFoodsMarketStores = filterByStore(stores, "Whole Foods Market");

    aldiStores = aldiStores.slice(counter.count);
    wholeFoodsMarketStores = wholeFoodsMarketStores.slice(counter.count);

    console.log(`${state}, United States`);
    await getPricesAldi(
      aldiStores,
      currentItemList,
      storeIndexes,
      counter.count
    );
    counter.subtract(aldiStores.length);

    await getPricesWholeFoodsMarket(
      wholeFoodsMarketStores,
      currentItemList,
      storeIndexes,
      counter.count
    );
    counter.subtract(wholeFoodsMarketStores.length);
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

class Counter {
  count = 0;
  constructor(count: number) {
    this.count = count;
  }

  subtract(amt: number) {
    this.count = Math.max(0, this.count - amt);
  }
}
