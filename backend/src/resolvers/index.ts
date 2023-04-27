import {
  locationsResolver,
  storeResolver,
  storeCountResolver,
  storesResolver,
  storeSearchResolver,
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
    storesSearch: storeSearchResolver,
    store: storeResolver,
    storesFromCompany: storesResolver,
    storeCount: storeCountResolver,
    company: companyResolver,
    companies: companiesResolver,
    item: itemResolver,
    itemsFromStore: itemStoreResolver,
    itemsFromCity: itemCityResolver,
    locations: locationsResolver,
    itemCount: itemCountResolver,
  },
};
