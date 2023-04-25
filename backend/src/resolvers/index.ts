import { DateTimeResolver, UUIDResolver } from "graphql-scalars";
import { storeResolver, storesResolver } from "./stores.js";
import { companyResolver } from "./company.js";
import { itemStoreResolver, itemCityResolver, itemResolver } from "./item.js";

export const root = {
  UUID: UUIDResolver,
  DateTime: DateTimeResolver,
  store: storeResolver,
  stores: storesResolver,
  company: companyResolver,
  item: itemResolver,
  itemsFromStore: itemStoreResolver,
  itemsFromCity: itemCityResolver,
};
