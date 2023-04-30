import { GraphQLError } from "graphql";

import { Context } from "../db/context.js";
import {
  Item,
  QueryItemArgs,
  QueryItemsFromCityArgs,
  QueryItemsFromStoreArgs,
} from "./resolvers-types.js";

export const itemResolver = async (
  _: {},
  { id, limit, offset }: QueryItemArgs,
  ctx: Context
) => {
  let item;

  item = await ctx.prisma.items.findUnique({
    where: {
      id,
    },
    include: {
      prices: { ...(limit ? { take: limit } : {}), skip: offset || 0 },
    },
  });

  return item as unknown as Item;
};

export const itemStoreResolver = async (
  _: {},
  { storeId, page, search, category }: QueryItemsFromStoreArgs,
  ctx: Context
) => {
  page = page || 1;

  if (!search && !storeId && !category) {
    throw new GraphQLError("No search term or storeId provided", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  const searchQuery = {
    ...(storeId && { storeId }),
    ...(search && { name: { contains: search } }),
    ...(category && { category }),
  };

  const [item, count, categoryData] = await Promise.all([
    ctx.prisma.items.findMany({
      where: searchQuery,
      take: 10,
      skip: (page - 1) * 10,
    }),
    ctx.prisma.items.count({
      where: searchQuery,
    }),
    ctx.prisma.items.groupBy({
      by: ["category"],
      where: searchQuery,
      _count: {
        category: true,
      },
    }),
  ]);

  return {
    items: item as unknown as Item[],
    total: count,
    categories: categoryData.map((data) => ({
      category: data.category,
      count: data._count.category,
    })),
  };
};

export const itemCityResolver = async (
  _: {},
  { city, page }: QueryItemsFromCityArgs,
  ctx: Context
) => {
  let item;

  item = await ctx.prisma.items.findFirst({
    where: {
      stores: {
        city,
      },
    },
    take: 10,
    skip: ((page || 1) - 1) * 10,
  });

  return item as unknown as Item[];
};

export const itemCountResolver = async (_: {}, __: {}, ctx: Context) => {
  const count = await ctx.prisma.items.count();
  return count;
};
