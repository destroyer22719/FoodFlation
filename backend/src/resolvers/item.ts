import { FieldNode, GraphQLError, GraphQLResolveInfo } from "graphql";
import {} from "@prisma/client";
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
  ctx: Context,
  info: GraphQLResolveInfo
) => {
  const selectedFields = info?.fieldNodes[0]?.selectionSet?.selections.map(
    (selection) => (selection as FieldNode).name.value
  );

  let item = await ctx.prisma.items.findUnique({
    where: {
      id,
    },
    include: {
      stores: selectedFields?.includes("stores"),
      prices: selectedFields?.includes("prices") && {
        ...(limit ? { take: limit } : {}),
        skip: offset || 0,
      },
    },
  });

  return item as unknown as Item;
};

export const itemStoreResolver = async (
  _: {},
  { storeId, page, search, category }: QueryItemsFromStoreArgs,
  ctx: Context,
  info: GraphQLResolveInfo
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

  const itemField = info?.fieldNodes[0]?.selectionSet?.selections.find(
    (selection) => (selection as FieldNode).name.value === "items"
  );

  let itemFieldsSelected: string[] | undefined;

  if (itemField) {
    itemFieldsSelected = (itemField as FieldNode).selectionSet?.selections.map(
      (selection) => (selection as FieldNode).name.value
    );
  }

  const [items, count, categoryData, resultsFound] = await Promise.all([
    ctx.prisma.items.findMany({
      where: searchQuery,
      take: 10,
      skip: (page - 1) * 10,
      include: {
        prices: itemFieldsSelected?.includes("prices") && {
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
  { city, page, search }: QueryItemsFromCityArgs,
  ctx: Context
) => {
  const searchQuery = {
    name: {
      contains: search,
    },
    stores: {
      city,
    },
  };

  const [items, resultsFound] = await Promise.all([
    ctx.prisma.items.findMany({
      where: searchQuery,
      take: 10,
      skip: ((page || 1) - 1) * 10,
      include: {
        prices: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        stores: true,
      },
    }),
    ctx.prisma.items.count({
      where: searchQuery,
    }),
  ]);

  return { items: items as unknown as Item[], resultsFound };
};

export const itemCountResolver = async (_: {}, __: {}, ctx: Context) => {
  const count = await ctx.prisma.items.count();
  return count;
};
