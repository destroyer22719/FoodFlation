import { FieldNode, GraphQLError, GraphQLResolveInfo } from "graphql";
import { Context } from "../db/context.js";
import {
  Item,
  QueryItemArgs,
  QueryItemsFromCityArgs,
  QueryItemsFromStoreArgs,
} from "./resolvers-types.js";
import { Items, Prisma } from "@prisma/client";

function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

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
        orderBy: {
          createdAt: "asc",
        },
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
  { city, page, search, sortByPrice, sortByAsc }: QueryItemsFromCityArgs,
  ctx: Context
) => {
  page ||= 1;

  type PreMappedItems = Items & {
    stores_id: string;
    stores_name: string;
    stores_street: string;
    stores_city: string;
    stores_postalCode: string;
    stores_companyId: string;
    stores_createdAt: string;
    stores_updatedAt: string;
    stores_province: string;
    stores_state: string | null;
    stores_zipCode: string | null;
    stores_country: string;
    prices_id: string;
    prices_price: number;
    prices_createdAt: string;
    prices_updatedAt: string;
    prices_itemId: string;
  };

  const getItemsQuery = ctx.prisma.$queryRaw<PreMappedItems[]>`
    SELECT 
      items.*,
      stores.id AS stores_id,
      stores.name AS stores_name,
      stores.street AS stores_street,
      stores.city AS stores_city,
      stores.postalCode AS stores_postalCode,
      stores.companyId AS stores_companyId,
      stores.createdAt AS stores_createdAt,
      stores.updatedAt AS stores_updatedAt,
      stores.province AS stores_province,
      stores.state AS stores_state,
      stores.zipCode AS stores_zipCode,
      stores.country AS stores_country,
      stores.country AS stores_country,
      prices.id AS prices_id,
      prices.price AS prices_price,
      prices.createdAt AS prices_createdAt,
      prices.updatedAt AS prices_updatedAt,
      prices.itemId AS prices_itemId
    FROM
      stores 
      INNER JOIN items ON stores.id = items.storeId 
      INNER JOIN prices ON prices.id = (
        SELECT 
          id 
        FROM 
          prices 
        WHERE 
          items.id = prices.itemId 
          AND prices.createdAt >= NOW() - INTERVAL 7 DAY 
        ORDER BY 
          prices.createdAt DESC 
        LIMIT 
          1
      ) 
    WHERE 
      stores.city = ${city}
      AND items.name LIKE ${`%${search}%`} 
      ORDER BY ${
        sortByPrice ? Prisma.sql`prices.price` : Prisma.sql`prices.createdAt`
      } 
      ${sortByAsc ? Prisma.sql`ASC` : Prisma.sql`DESC`}
    LIMIT 10 OFFSET ${(page - 1) * 10}
  `;
  const getItemsCountQuery = ctx.prisma.$queryRaw<{ "COUNT(*)": bigint }[]>`
  SELECT COUNT(*)
  FROM
    stores
    INNER JOIN items ON stores.id = items.storeId
    INNER JOIN (
      SELECT *
      FROM prices
      WHERE createdAt >= NOW() - INTERVAL 7 DAY
    ) as prices ON items.id = prices.itemId
  WHERE 
    stores.city = ${city}
    AND items.name LIKE ${`%${search}%`}
`;

  let [query, resultsFound] = await Promise.all([
    getItemsQuery,
    getItemsCountQuery,
  ]);

  const parsedQuery = query.map((item) => {
    return {
      id: item.id,
      name: item.name,
      storeId: item.storeId,
      imgUrl: item.imgUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      unit: item.unit,
      stores: {
        id: item.stores_id,
        name: item.stores_name,
        street: item.stores_street,
        city: item.stores_city,
        postalCode: item.stores_postalCode,
        companyId: item.stores_companyId,
        createdAt: item.stores_createdAt,
        updatedAt: item.stores_updatedAt,
        province: item.stores_province,
        state: item.stores_state,
        zipCode: item.stores_zipCode,
        country: item.stores_country,
      },
      prices: [
        {
          id: item.prices_id,
          price: round(item.prices_price),
          createdAt: item.prices_createdAt,
          updatedAt: item.prices_updatedAt,
          itemId: item.prices_itemId,
        },
      ],
    };
  });

  return {
    items: parsedQuery,
    resultsFound: Number(resultsFound[0]["COUNT(*)"]),
  };
};

export const itemCountResolver = async (_: {}, __: {}, ctx: Context) => {
  const count = await ctx.prisma.items.count();
  return count;
};
