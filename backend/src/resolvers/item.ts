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
    storeId: storeId as string | undefined,
    category: category as string | undefined,
    ...(search && { name: { contains: search } }),
  };

  const [items, count, categoryData, resultsFound] = await Promise.all([
    ctx.prisma.items.findMany({
      where: searchQuery,
      take: 10,
      skip: (page - 1) * 10,
      include: {
        prices: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
    ctx.prisma.items.count(),
    ctx.prisma.items.groupBy({
      by: ["category"],
      where: searchQuery,
      _count: {
        category: true,
      },
    }),
    ctx.prisma.items.count({
      where: searchQuery,
    }),
  ]);

  return {
    items: items as unknown as Item[],
    total: count,
    categories: categoryData.map((data) => ({
      category: data.category,
      count: data._count.category,
    })),
    resultsFound,
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
