import {
  Address,
  AmericanStoresOptions,
  CanadianStoresOptions,
  CompanyName,
  Province,
  State,
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
  province: Province,
  state: State,
  itemStart: number = 0,
  storeStart: number = 0,
  storeIndex: StoreIndex,
  canadianStoreOptions?: CanadianStoresOptions,
  americanStoreOptions?: AmericanStoresOptions
): StoreLists {
  let totalStores = 0;

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
      storeList.us[st] = newStores;
      storeStart -= stores.length;
      totalStores += newStores.length;
    } else {
      storeList.us[st] = stores;
    }
  }

  storeIndex.storeTotal = totalStores;
  return storeList;
}

export async function scrapeStores(
  storeList: StoreLists,
  storeIndex: StoreIndex
) {}

export async function scrapeStore(
  stores: Address[],
  items: string[],
  storeIndex: StoreIndex,
  firstItems?: string[]
) {
  let currentItemList = firstItems || items;

  const loblawsStores = stores.filter((store) => store.company === "Loblaws");
  const metroStores = stores.filter((store) => store.company === "Metro");
  const noFrillsStores = stores.filter(
    (store) => store.company === "No Frills"
  );
  const wholeFoodsMarketStores = stores.filter(
    (store) => store.company === "Whole Foods Market"
  );
  const aldiStores = stores.filter((store) => store.company === "Aldi");
  const targetStores = stores.filter((store) => store.company === "Target");

  if (loblawsStores.length) {
    await getPricesLoblaws(currentItemList, loblawsStores, storeIndex);
  }
}

// export async function scrapeCanada(
//   province: Province,
//   itemStart: number = 0,
//   storeStart: number = 0,
//   storesOptions: CanadianStoresOptions,
//   storeIndex: StoreIndexf
// ) {
//   const { items } = JSON.parse(
//     fs.readFileSync(
//       path.join(__dirname, "src", "config", "items.json"),
//       "utf-8"
//     )
//   );

//   let provinces: Province[] = province
//     ? [province]
//     : ["alberta", "british_columbia", "ontario", "quebec"];

//   for (const prov of provinces) {
//     console.log(prov);

//     const { stores } = JSON.parse(
//       fs.readFileSync(
//         path.join(__dirname, "src", "config", "canada", `${prov}.json`),
//         "utf-8"
//       )
//     );

//     await storeScrape(
//       items,
//       stores,
//       itemStart,
//       storeStart,
//       storesOptions,
//       storeIndex
//     );
//   }
// }

// export async function scrapeAmerica(
//   state: State,
//   itemStart: number = 0,
//   storeStart: number = 0,
//   storesOptions: AmericanStoresOptions,
//   storeIndex: StoreIndex
// ) {
//   const { items } = JSON.parse(
//     fs.readFileSync(
//       path.join(__dirname, "src", "config", "items.json"),
//       "utf-8"
//     )
//   );

//   let states: State[] = state
//     ? [state]
//     : ["new_york", "california", "texas", "michigan"];

//   for (const st of states) {
//     console.log(st);

//     const { stores } = JSON.parse(
//       fs.readFileSync(
//         path.join(__dirname, "src", "config", "united_states", `${st}.json`),
//         "utf-8"
//       )
//     );

//     await storeScrape(
//       items,
//       stores,
//       itemStart,
//       storeStart,
//       storesOptions,
//       storeIndex
//     );
//   }
// }

// export async function scrapeAll(
//   province: Province,
//   state: State,
//   itemStart: number = 0,
//   storeStart: number = 0,
//   storesOptions: StoresOptions,
//   storeIndex: StoreIndex
// ) {
//   const { items } = JSON.parse(
//     fs.readFileSync(
//       path.join(__dirname, "src", "config", "items.json"),
//       "utf-8"
//     )
//   );

//   let provinces: Province[] = [
//     "alberta",
//     "british_columbia",
//     "ontario",
//     "quebec",
//   ];

//   let states: State[] = ["new_york", "california", "texas", "michigan"];

//   provinces = provinces.slice(
//     province ? provinces.indexOf(province as Province) : 0
//   );

//   states = states.slice(state ? states.indexOf(state as State) : 0);

//   for (const prov of provinces) {
//     console.log(prov);

//     const { stores } = JSON.parse(
//       fs.readFileSync(
//         path.join(__dirname, "src", "config", "canada", `${prov}.json`),
//         "utf-8"
//       )
//     );

//     await storeScrape(
//       items,
//       stores,
//       itemStart,
//       storeStart,
//       storesOptions,
//       storeIndex
//     );
//   }

//   for (const st of states) {
//     console.log(st);

//     const { stores } = JSON.parse(
//       fs.readFileSync(
//         path.join(__dirname, "src", "config", "united_states", `${st}.json`),
//         "utf-8"
//       )
//     );

//     await storeScrape(
//       items,
//       stores,
//       itemStart,
//       storeStart,
//       storesOptions,
//       storeIndex
//     );
//   }
// }

// const storeScrape = async (storeList: StoreLists, storeIndex: StoreIndex) => {
//   const { aldi, loblaws, metro, noFrills, wholeFoodsMarket, target } =
//     storesOptions;

//   if (loblaws) {
//     await getPricesLoblaws(
//       items,
//       filterByStore(stores, "Loblaws"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else if (metro) {
//     await getPricesMetro(
//       items,
//       filterByStore(stores, "Metro"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else if (noFrills) {
//     await getPricesNoFrills(
//       items,
//       filterByStore(stores, "No Frills"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else if (target) {
//     await getPricesTarget(
//       items,
//       filterByStore(stores, "Target"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else if (wholeFoodsMarket) {
//     await getPricesWholeFoodsMarket(
//       items,
//       filterByStore(stores, "Whole Foods Market"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else if (aldi) {
//     await getPricesAldi(
//       items,
//       filterByStore(stores, "Aldi"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//   } else {
//     await getPricesLoblaws(
//       items,
//       filterByStore(stores, "Loblaws"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//     await getPricesMetro(
//       items,
//       filterByStore(stores, "Metro"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//     await getPricesNoFrills(
//       items,
//       filterByStore(stores, "No Frills"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//     await getPricesWholeFoodsMarket(
//       items,
//       filterByStore(stores, "Whole Foods Market"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//     await getPricesAldi(
//       items,
//       filterByStore(stores, "Aldi"),
//       storeStart,
//       itemStart,
//       storeIndex
//     );
//     // await getPricesTarget(
//     //   items,
//     //   filterByStore(stores, "Target"),
//     //   storeStart,
//     //   itemStart
//     // );
//   }
// };

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
