import {
  locationsResolver,
  storeResolver,
  storesCountResolver,
  storesResolver,
} from "./stores.js";
import { companiesResolver, companyResolver } from "./company.js";
import {
  itemStoreResolver,
  itemCityResolver,
  itemResolver,
  itemCountResolver,
} from "./item.js";
import { Resolvers } from "./resolvers-types.js";

export const resolvers: Resolvers = {
  Query: {
    store: storeResolver,
    stores: storesResolver,
    storesCount: storesCountResolver,
    company: companyResolver,
    companies: companiesResolver,
    item: itemResolver,
    itemsFromStore: itemStoreResolver,
    itemsFromCity: itemCityResolver,
    locations: locationsResolver,
    itemCount: itemCountResolver,
  },
};
