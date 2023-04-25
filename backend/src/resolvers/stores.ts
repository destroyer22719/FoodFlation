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

export const storeCountResolver = async () => {
  const storeCount = await prisma.stores.count();

  return storeCount;
};

export const locationsResolver = async () => {  
  const storesByLocation = await prisma.stores.groupBy({
    by: ["country", "state", "province", "city"],
    _count: {
      city: true,
    },
  });

  return storesByLocation;
};
