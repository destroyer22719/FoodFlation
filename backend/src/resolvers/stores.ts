import { Context } from "../db/context.js";
import {
  Location,
  QueryStoreArgs,
  QueryStoresSearchArgs,
  Store,
} from "./resolvers-types.js";

export const storeResolver = async (
  _: {},
  { id }: QueryStoreArgs,
  ctx: Context
) => {
  const store = await ctx.prisma.stores.findUnique({
    where: {
      id,
    },
    include: {
      companies: true,
    },
  });

  return store as unknown as Store;
};

export const storeCountResolver = async (_: {}, __: {}, ctx: Context) => {
  const storesCount = await ctx.prisma.stores.count();
  return storesCount;
};

export const locationsResolver = async (_: {}, __: {}, ctx: Context) => {
  const storesByLocation = await ctx.prisma.stores.groupBy({
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
  { city, page, postalCode, zipCode, companyId }: QueryStoresSearchArgs,
  ctx: Context
) => {
  const searchCondition = {
    city: city as string | undefined,
    companyId: companyId as string | undefined,
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
    ctx.prisma.stores.count({
      where: searchCondition,
    }),
    ctx.prisma.stores.findMany({
      where: searchCondition,
      skip: ((page || 1) - 1) * 10,
      take: 10,
    }),
  ]);

  return { stores: stores as unknown as Store[], total };
};
