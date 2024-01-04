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
  results.forEach(async ({ name, imgUrl, unit, price }) => {
    let item = await prisma.items.findFirst({
      where: {
        name,
        storeId,
        imgUrl,
      },
    });
    if (!item) {
      item = await prisma.items.create({
        data: {
          name,
          unit,
          storeId,
          imgUrl,
          category: item2category[name],
        },
      });
    }
    try {
      await prisma.prices.create({
        data: {
          price,
          itemId: item.id,
        },
      });
    } catch (err) {
      console.log("\n")
      console.log(name);
      console.log(price);
      console.log(unit);
      console.log(imgUrl);
      
      console.log(item);
      console.log(item.storeId);
      throw new Error(err);
    }
  });
};
