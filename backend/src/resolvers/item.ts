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
  { storeId, page }: QueryItemsFromStoreArgs
) => {
  page = page || 1;

  const item = await prisma.items.findMany({
    where: {
      storeId,
    },
    take: 10,
    skip: (page - 1) * 10,
  });

  return item as unknown as Item[];
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
