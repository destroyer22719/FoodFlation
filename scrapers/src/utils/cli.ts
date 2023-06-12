import fs from "fs";
import path from "path";
// import { getPricesLoblaws } from "../stores/loblaws.js";
import { getPricesLoblaws } from "../stores/loblawsApi.js";

import { getPricesMetro } from "../stores/metro.js";
import { getPricesWholeFoodsMarket } from "../stores/whole_foods_market.js";
import { getPricesAldi } from "../stores/aldi.js";
import { getPricesNoFrills } from "../stores/nofrills.js";
import { storeStartSet } from "../index.js";

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
              ...filteredStores,
              ...filterByStore(stores, "Whole Foods Market"),
            ];
          }
        }
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

  let storeStartSetOrNotFound = storeStartSet;

  for (const prov in canada) {
    const stores: Address[] = canada[prov];
    const prevStoreStart = storeStart;

    if (!stores.length) continue;
    if (storeStartSetOrNotFound && storeStart < storeIndexes.storeIndex) {
      let min = Math.min(stores.length, storeIndexes.storeIndex - storeStart);
      storeStart += min;
      if (min === stores.length) continue;
    }

    const counter = new Counter(
      storeStartSetOrNotFound ? storeIndexes.storeIndex - prevStoreStart : 0
    );

    const allLoblawsStores = filterByStore(stores, "Loblaws");
    const allMetroStores = filterByStore(stores, "Metro");
    const allNoFrillsStores = filterByStore(stores, "No Frills");

    console.log(`${prov}, Canada`);

    const loblawsStores = allLoblawsStores.slice(counter.count);
    if (loblawsStores.length) {
      await getPricesLoblaws(
        loblawsStores,
        currentItemList,
        storeIndexes,
        counter.count
      );
      currentItemList = items;
    }

    counter.subtract(Math.min(allLoblawsStores.length, counter.count));
    const metroStores = allMetroStores.slice(counter.count);

    if (metroStores.length) {
      await getPricesMetro(
        metroStores,
        currentItemList,
        storeIndexes,
        counter.count
      );
      currentItemList = items;
    }

    counter.subtract(Math.min(allMetroStores.length, counter.count));
    const noFrillsStores = allNoFrillsStores.slice(counter.count);

    if (noFrillsStores.length) {
      await getPricesNoFrills(
        noFrillsStores,
        currentItemList,
        storeIndexes,
        counter.count
      );
      currentItemList = items;
    }

    storeStartSetOrNotFound = false;
  }

  for (const state in us) {
    const stores: Address[] = us[state];
    const prevStoreStart = storeStart;

    if (!stores.length) {
      continue;
    }

    //we keep on increasing storeStart until it is equal to storeIndex
    if (storeStartSetOrNotFound && storeStart < storeIndexes.storeIndex) {
      let min = Math.min(stores.length, storeIndexes.storeIndex - storeStart);
      storeStart += min;
      if (min === stores.length) {
        continue;
      }
    }

    //creating a counter to keep track of the amount of stores left to scrape
    const counter = new Counter(
      storeStartSetOrNotFound ? storeIndexes.storeIndex - prevStoreStart : 0
    );

    const allAldiStores = filterByStore(stores, "Aldi");
    const allWholeFoodsMarketStores = filterByStore(
      stores,
      "Whole Foods Market"
    );

    console.log(`${state}, United States`);
    const aldiStores = allAldiStores.slice(counter.count);

    if (aldiStores.length) {
      await getPricesAldi(
        aldiStores,
        currentItemList,
        storeIndexes,
        counter.count
      );
      currentItemList = items;
    }

    counter.subtract(Math.min(allAldiStores.length, counter.count));
    const wholeFoodsMarketStores = allWholeFoodsMarketStores.slice(
      counter.count
    );

    if (wholeFoodsMarketStores.length) {
      await getPricesWholeFoodsMarket(
        wholeFoodsMarketStores,
        currentItemList,
        storeIndexes,
        counter.count
      );
      currentItemList = items;
    }

    storeStartSetOrNotFound = false;
  }
}

function filterByStore(array: Address[], company: CompanyName): Address[] {
  return array.filter((store) => store.company === company);
}

class Counter {
  count = 0;
  constructor(count: number) {
    this.count = count;
  }

  subtract(amt: number) {
    this.count = Math.max(0, this.count - amt);
  }
}
