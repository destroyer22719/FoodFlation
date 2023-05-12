import Image from "next/image";

import { DataSet } from "./util";
import ChartComponent from "./ClientComponents/ChartComponent";

import styles from "@/styles/pages/Item.module.scss";
import timeAgo from "util/timeAgo";
import { getItemsAndItsStoreData } from "@/graphql/queries";
import { notFound } from "next/navigation";
import StoreItem from "@/components/StoreItem/StoreItem";

type Props = {
  params: { id: string };
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
    let date = new Date(+createdAt).toISOString().split("T")[0];

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

  return (
    <>
      <div>
        <div>
          <div>
            <h1>{item.name}</h1>
          </div>
          <div>
            {greaterThanTwoWeeks && (
              <h3>
                Warning: Price may be outdated as it is from{" "}
                {timeAgo(lastUpdated)}
              </h3>
            )}
          </div>
          <div>
            <Image width={200} height={200} src={item.imgUrl} alt={item.name} />
            <StoreItem store={item.stores as Store} />
          </div>
        </div>
      </div>

      <div>
        <div>
          <div>
            <div>
              Latest: {"$"}
              {parsedPrices[parsedPrices.length - 1].y} on
              {parsedPrices[parsedPrices.length - 1].x} {"("}
              {timeAgo(lastUpdated)}
              {")"}
            </div>
            <div>
              Highest: {"$"}
              {highest.y} on {highest.x} {"("}
              {timeAgo(new Date(highest.x))}
              {")"}
            </div>
            <div>
              Lowest: {"$"}
              {lowest.y} on {lowest.x} {"("}
              {timeAgo(new Date(lowest.x))}
              {")"}
            </div>
          </div>
          {/* <CategoryButton category={item.category} /> */}
        </div>
      </div>
      <div>
        <ChartComponent pricesData={parsedPrices} />
      </div>
    </>
  );
};

export default ItemPage;
