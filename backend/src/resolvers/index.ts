import { locationsResolver, storeResolver, storesResolver } from "./stores.js";
import { companiesResolver, companyResolver } from "./company.js";
import { itemStoreResolver, itemCityResolver, itemResolver } from "./item.js";
import { Resolvers } from "./resolvers-types.js";

export const resolvers: Resolvers = {
  Query: {
    store: storeResolver,
    stores: storesResolver,
    company: companyResolver,
    companies: companiesResolver,
    item: itemResolver,
    itemsFromStore: itemStoreResolver,
    itemsFromCity: itemCityResolver,
    locations: locationsResolver,
  },
};
