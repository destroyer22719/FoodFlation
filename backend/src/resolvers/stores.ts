import { prisma } from "../db/index.js";
import {
  Location,
  QueryStoreArgs,
  QueryStoresFromCompanyArgs,
  QueryStoresSearchArgs,
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

export const storesResolver = async (
  _: {},
  { companyId, page }: QueryStoresFromCompanyArgs
) => {
  page = page || 1;
  const stores = await prisma.stores.findMany({
    where: {
      companyId,
    },
    skip: (page - 1) * 10,
    take: 10,
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

  const result: Location[] = storesByLocation.map((location) => ({
    country: location.country,
    city: location.city,
    province: location.province,
    state: location.state,
    _count: location._count.city,
  }));

  return result;
};

export const storeSearchResolver = async (
  _: {},
  { city, page, postalCode, zipCode }: QueryStoresSearchArgs
) => {
  const searchCondition = {
    ...(city && { city }),
    ...(postalCode || zipCode
      ? {
          OR: [
            {
              postalCode,
            },
            {
              zipCode,
            },
          ],
        }
      : {}),
  };

  const [total, stores] = await Promise.all([
    prisma.stores.count({
      where: searchCondition,
    }),
    prisma.stores.findMany({
      where: searchCondition,
      skip: ((page || 1) - 1) * 10,
      take: 10,
    }),
  ]);

  return { stores: stores as unknown as Store[], total };
};
