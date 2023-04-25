import { prisma } from "../db/index.js";

export const itemResolver = async ({
  id,
  limit,
  offset,
}: {
  id: string;
  limit?: number;
  offset?: number;
}) => {
  let item;
  let pricesQuery;

  if (limit || offset) {
    limit = limit || 10;
    offset = offset || 0;

    pricesQuery = {
      take: limit,
      skip: offset,
    };
  }

  item = await prisma.items.findUnique({
    where: {
      id,
    },
    include: { prices: { ...pricesQuery } },
  });

  return item;
};

export const itemStoreResolver = async ({
  storeId,
  page,
}: {
  storeId: string;
  page?: number;
}) => {
  let item;

  page = page || 1;

  item = await prisma.items.findFirst({
    where: {
      storeId,
    },
    take: 10,
    skip: (page - 1) * 10,
  });

  return item;
};

export const itemCityResolver = async ({
  city,
  page,
}: {
  city: string;
  page?: number;
}) => {
  let item;

  page = page || 1;

  item = await prisma.items.findFirst({
    where: {
      stores: {
        city,
      },
    },
    take: 10,
    skip: (page - 1) * 10,
  });

  return item;
};
