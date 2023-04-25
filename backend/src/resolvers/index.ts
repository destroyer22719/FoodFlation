import { locationsResolver, storeResolver, storesResolver } from "./stores.js";
import { companyResolver } from "./company.js";
import { itemStoreResolver, itemCityResolver, itemResolver } from "./item.js";

export const root = {
  store: storeResolver,
  stores: storesResolver,
  company: companyResolver,
  item: itemResolver,
  itemsFromStore: itemStoreResolver,
  itemsFromCity: itemCityResolver,
  locations: locationsResolver,
};

export const resolvers = {
  Query: { ...root },
};
