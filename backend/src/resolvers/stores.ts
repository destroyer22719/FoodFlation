import { prisma } from "../db/index.js";

export const storeResolver = async ({ id }: { id: string }) => {
  const store = await prisma.stores.findUnique({
    where: {
      id,
    },
  });

  return store;
};

const store = await storeResolver({ id: "25bb80e4-9041-4c4f-b753-3a1eb523795f" });

console.log(store);
