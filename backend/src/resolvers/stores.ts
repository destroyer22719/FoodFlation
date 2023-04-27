import { prisma } from "../db/index.js";
import {
  Location,
  QueryStoreArgs,
  QueryStoresArgs,
  Store,
} from "./resolvers-types.js";

export const storeResolver = async (_: {}, { id }: QueryStoreArgs) => {
  const store = await prisma.stores.findUnique({
    where: {
      id,
    },
  });

  return store as unknown as Store;
};

export const storesResolver = async (_: {}, { companyId }: QueryStoresArgs) => {
  const stores = await prisma.stores.findMany({
    where: {
      companyId,
    },
  });

  return stores as unknown as Store[];
};

export const storeCountResolver = async () => {
  const storesCount = await prisma.stores.count();
  return storesCount;
};

export const locationsResolver = async () => {
  const storesByLocation = await prisma.stores.groupBy({
    by: ["country", "state", "province", "city"],
    _count: {
      city: true,
    },
  });

  return storesByLocation as Location[];
};
