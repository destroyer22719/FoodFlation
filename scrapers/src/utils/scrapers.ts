import fs from "fs";
import path from "path";

import { prisma } from "../db/index.js";

export const msToTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

const item2category = JSON.parse(fs.readFileSync(path.join(__dirname, "src", "config", "item2category.json"), "utf-8"));

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
        companyId,
        ...(isCanada
          ? {
              country: "Canada",
              postalCode,
              province,
            }
          : {
              country: "United States",
              zipCode,
              state,
            }),
      },
    });
    console.log(`Created ${store.name} in ${store.city}, ${store.country} | ${store.id}`);
  }

  return store.id;
};

export const loaderDisplay = ({
  itemIndex,
  totalItems,
  storeIndex,
  totalStores,
  storeScrapedIndex,
  message = "",
}: LoaderDisplayParams) => {
  return `${itemIndex}/${totalItems} items | ${storeIndex}/${totalStores} stores | ${storeScrapedIndex} stores scraped | ${message}`;
};

export const updateItems = async ({ results, storeId }: UpdateItemsParams) => {
  const resultNames = results.map((result) => result.name);

  let itemObjs = await prisma.items.findMany({
    where: { storeId, name: { in: resultNames } },
  });

  if (itemObjs.length !== results.length) {
    const itemsNotFound = results.filter(
      //this checks for any items that are not in the database by checking if the name is in the resultNames array
      (result) => itemObjs.map((item) => item.name).indexOf(result.name) === -1
    );

    const newItems = await Promise.all(
      itemsNotFound.map(async ({ name, imgUrl, unit }) => {
        const item = await prisma.items.create({
          data: {
            name,
            storeId,
            imgUrl,
            category: item2category[name],
            unit,
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
      itemId: itemObjs.find((itemObj) => {
        return itemObj.name.toLowerCase() === result.name.toLowerCase();
      })!.id,
    })),
  });
};
