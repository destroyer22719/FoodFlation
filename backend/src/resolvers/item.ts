import { GraphQLError } from "graphql";

import { prisma } from "../db/index.js";
import {
  Item,
  QueryItemArgs,
  QueryItemsFromCityArgs,
  QueryItemsFromStoreArgs,
} from "./resolvers-types.js";

export const itemResolver = async (
  _: {},
  { id, limit, offset }: QueryItemArgs
) => {
  let item;

  item = await prisma.items.findUnique({
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
  { storeId, page, search }: QueryItemsFromStoreArgs
) => {
  page = page || 1;

  if ((!search || search === "") && (!storeId || storeId === "")) {
    throw new GraphQLError("No search term or storeId provided", {
      extensions: {
        code: "BAD_USER_INPUT",
      }
    });
  }

  const searchQuery = {
    ...(storeId && { storeId }),
    ...(search && { name: { contains: search } }),
  };

  const [item, count, categoryData] = await Promise.all([
    prisma.items.findMany({
      where: searchQuery,
      take: 10,
      skip: (page - 1) * 10,
    }),
    prisma.items.count({
      where: searchQuery,
    }),
    prisma.items.groupBy({
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
  { city, page }: QueryItemsFromCityArgs
) => {
  let item;

  item = await prisma.items.findFirst({
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

export const itemCountResolver = async () => {
  const count = await prisma.items.count();
  return count;
};
