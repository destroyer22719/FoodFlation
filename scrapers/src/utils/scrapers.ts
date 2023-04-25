import { prisma } from "src/db";
import fs from "fs";
import path from "path";

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

type UpdateItemParams = {
  storeId: string;
  result: {
    name: string;
    price: string;
    imgUrl: string;
  };
};

const __dirname = path.resolve();

const item2category = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "src", "config", "item2category.json"),
    "utf-8"
  )
);

export const updateItem = async ({ result, storeId }: UpdateItemParams) => {
  let itemObj = await prisma.items.findFirst({
    where: { name: result.name, storeId },
  });

  if (!itemObj) {
    itemObj = await prisma.items.create({
      data: {
        name: result.name,
        storeId,
        imgUrl: result.imgUrl,
      },
    });
  } else if (itemObj.category !== item2category[result.name]) {
    await prisma.items.update({
      where: { id: itemObj.id },
      data: { category: item2category[result.name] },
    });
  }

  await prisma.prices.create({
    data: {
      price: parseFloat(result.price),
      itemId: itemObj.id,
    },
  });
};
