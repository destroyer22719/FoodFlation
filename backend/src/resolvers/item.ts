import { prisma } from "../db/index.js";

export const itemResolver = async ({
  id,
  limit = 10,
  offset = 0,
}: {
  id: string;
  limit?: number;
  offset?: number;
}) => {
  let item;

  item = await prisma.items.findUnique({
    where: {
      id,
    },
    include: { prices: { take: limit, skip: offset } },
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
  page = 1,
}: {
  city: string;
  page?: number;
}) => {
  let item;

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

export const itemCountResolver = async () => {
  const count = await prisma.items.count();
  return count;
};
