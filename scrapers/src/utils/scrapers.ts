import fs from "fs";
import path from "path";

import { prisma } from "../db/index.js";

export const msToTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const defaultItems = [
  "eggs",
  "milk",
  "butter",
  "flour",
  "bacon",
  "pork",
  "beef",
  "ground beef",
  "chicken breasts",
  "chicken wings",
  "tomatoes",
  "cheese",
  "bananas",
  "lettuce",
  "onions",
  "broccoli",
  "rice",
  "cooking oil",
  "salmon",
  "tuna",
  "cucumbers",
  "potatoes",
  "bread",
  "cereal",
  "beets",
  "radish",
  "mushrooms",
  "watermelons",
  "garlic",
  "ham",
  "sausages",
  "turkey",
];

const __dirname = path.resolve();

const item2category = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "src", "config", "item2category.json"),
    "utf-8"
  )
);

export const getCompanyId = async (name: string) => {
  const company = await prisma.companies.upsert({
    where: { name },
    update: {},
    create: {
      name,
    },
  });

  return company.id;
};

export const getStoreId = async ({
  companyId,
  postalCode,
  zipCode,
  state,
  province,
  city,
  street,
  country,
  name,
}: GetStoreIdParams) => {
  const isCanada = country === "canada";
  let store = await prisma.stores.findFirst({
    where: {
      ...(isCanada ? { postalCode } : { zipCode }),
      companyId: companyId,
    },
  });

  if (!store) {
    store = await prisma.stores.create({
      data: {
        name,
        street,
        city,
        country,
        companyId,
        ...(isCanada
          ? {
              postalCode,
              province,
            }
          : {
              zipCode,
              state,
            }),
      },
    });
    console.log(
      `Created ${store.name} in ${store.city}, ${store.country} | ${store.id}`
    );
  }

  return store.id;
};

export const updateItems = async ({ results, storeId }: UpdateItemsParams) => {
  const resultNames = results.map((result) => result.name);

  let itemObjs = await prisma.items.findMany({
    where: { storeId, name: { in: resultNames } },
  });

  if (itemObjs.length !== results.length) {
    const foundItems = itemObjs.map((itemObj) => itemObj.name);
    const itemsNotFound = resultNames.filter(
      (name) => foundItems.indexOf(name) === -1
    );

    const newItems = await Promise.all(
      itemsNotFound.map(async (name) => {
        const item = await prisma.items.create({
          data: {
            name,
            storeId,
            imgUrl: results.find((result) => result.name === name)!.imgUrl,
            category: item2category[name],
          },
        });
        return item;
      })
    );

    itemObjs = [...itemObjs, ...newItems];
  }

  await prisma.prices.createMany({
    data: results.map((result) => ({
      price: result.price,
      itemId: itemObjs.find((itemObj) => itemObj.name === result.name)!.id,
    })),
  });
};
