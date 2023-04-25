import { prisma } from "../db/index.js";

export const storeResolver = async ({ id }: { id: string }) => {
  const store = await prisma.stores.findUnique({
    where: {
      id,
    },
  });

  return store;
};

export const storesResolver = async ({ companyId }: { companyId: string }) => {
  const stores = await prisma.stores.findMany({
    where: {
      companyId,
    },
  });

  return stores;
};
