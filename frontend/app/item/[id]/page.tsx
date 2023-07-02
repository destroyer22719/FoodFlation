import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import ChartComponent from "./components/ChartComponent";
import CriticalValuesComponents from "./components/CriticalValuesComponents";
import Header from "./components/Header";

import timeAgo from "@/utils/timeAgo";
import { getItemsAndItsStoreData } from "@/graphql/queries";
import StoreItem from "@/components/StoreItem/StoreItem";

import styles from "@/styles/pages/Item.module.scss";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const item = await getItemsAndItsStoreData(id);

  if (!item) {
    notFound();
  }

  return {
    title: `FoodFlation | ${item.name}`,
  };
}

type Props = {
  params: { id: string };
};

export type DataSet = {
  x: string;
  y: number;
};

const ItemPage = async ({ params }: Props) => {
  const { id } = params;

  const item = await getItemsAndItsStoreData(id);

  if (!item) {
    return notFound();
  }

  const { prices } = item;
  //dates
  const xDataset: string[] = [];
  //prices
  const yDataset: number[] = [];

  const highest: DataSet = { x: "", y: -Infinity };
  const lowest: DataSet = { x: "", y: Infinity };

  prices.forEach(({ createdAt, price }) => {
    const date = new Date(+createdAt).toISOString().split("T")[0];

    //check if the dataset already has this date and price
    const dupeIndex = xDataset.indexOf(date);
    if (dupeIndex !== -1 && yDataset[dupeIndex] === price) return;
    //remove the previous dataset with the same date, so this the graph gets the latest price of that day
    if (dupeIndex !== -1 && xDataset[dupeIndex] === date) {
      yDataset.splice(dupeIndex, 1);
      xDataset.splice(dupeIndex, 1);
    }

    xDataset.push(date);
    yDataset.push(price);

    if (price > highest.y) {
      highest.y = price;
      highest.x = date;
    }
    if (price < lowest.y) {
      lowest.y = price;
      lowest.x = date;
    }
  });

  const parsedPrices: DataSet[] = [];

  for (let i = 0; i < yDataset.length; i++) {
    parsedPrices.push({
      x: xDataset[i],
      y: yDataset[i],
    });
  }

  const lastUpdated = new Date(parsedPrices[parsedPrices.length - 1].x);
  const greaterThanTwoWeeks = Date.now() - lastUpdated.getTime() > 12096e5;

  const criticalValuesProps = {
    highest: {
      price: highest.y,
      date: highest.x,
    },
    lowest: {
      price: lowest.y,
      date: lowest.x,
    },
    latest: {
      price: parsedPrices[parsedPrices.length - 1].y,
      date: parsedPrices[parsedPrices.length - 1].x,
    },
  };

  return (
    <>
      <div className={styles["item__info"]}>
        <Header
          category={item.category}
          name={item.name}
          storeId={item.stores.id}
        />
        <div>
          {greaterThanTwoWeeks && (
            <h3>
              Warning: Price may be outdated as it is from{" "}
              {timeAgo(lastUpdated)}
            </h3>
          )}
        </div>
        <div className={styles["item__imgs--format"]}>
          <div className={styles["item__img"]}>
            <Image
              fill={true}
              src={item.imgUrl}
              alt={item.name}
              priority={true}
            />
          </div>
          <StoreItem store={item.stores as Store} />
        </div>
        <div>
          <CriticalValuesComponents {...criticalValuesProps} />
        </div>
      </div>
      <div>
        <ChartComponent pricesData={parsedPrices} unit={item.unit || "unit"}/>
      </div>
    </>
  );
};

export default ItemPage;
