import { GetServerSideProps } from "next";
import { API_URL } from "../../config";
import { Item } from "../../global";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Image from "next/image";
import Layout from "../../components/Layout";
import styles from "../../styles/Item.module.scss";
import { useRouter } from "next/router";
import CategoryButton from "../../components/CustomButtonComponents/CategoryButton";
import ButtonContained from "../../components/CustomButtonComponents/ButtonContained";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  item: Item;
  timeStrAgo: string;
  timeNumAgo: number;
};

type DataSet = {
  x: string;
  y: number;
};

ChartJS.defaults.font.size = 20;
ChartJS.defaults.font.weight = "bold";
ChartJS.defaults.color = "white";

TimeAgo.addDefaultLocale(en);
const ItemPage: React.FC<Props> = ({ item, timeNumAgo, timeStrAgo }) => {
  const router = useRouter();
  const timeAgo = new TimeAgo("en-US");

  const { prices } = item;
  //dates
  const xDataset: string[] = [];
  //prices
  const yDataset: number[] = [];

  const highest: DataSet = { x: "", y: -Infinity };
  const lowest: DataSet = { x: "", y: Infinity };

  prices.forEach(({ createdAt, price }) => {
    const date = new Date(createdAt).toISOString().split("T")[0];

    const dupeIndex = xDataset.indexOf(date);

    if (
      dupeIndex !== -1 &&
      yDataset[dupeIndex] === price //check if the dataset already has this date and price
    )
      return;
    if (dupeIndex !== -1 && xDataset[dupeIndex] === date) {
      //remove the previous dataset with the same date, so this the graph gets the latest price of that day
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

  const data = {
    label: "Date",
    datasets: [
      {
        label: "Item Price",
        fill: true,
        borderColor: "rgb(255,255,255)",
        data: parsedPrices,
        borderWidth: 5,
      },
    ],
  };

  return (
    <Layout title={item.name || "Item Not Found"}>
      {item.id ? (
        <>
          <div className={styles["item-page__header"]}>
            <div onClick={() => router.back()}>
              <ButtonContained className={styles["item-page__back-button"]}>
                {"<"}
              </ButtonContained>
            </div>
            <div className={styles["item-page__header-metada"]}>
              <div>
                <h1>{item.name}</h1>
              </div>
              {1000 * 60 * 60 * 24 * 14 < timeNumAgo && (
                <h3>
                  Warning: Price may be outdated as it is from {timeStrAgo}
                </h3>
              )}
              <div>
                <p>
                  {item.store.street}, {item.store.city} {item.store.postalCode}
                </p>
              </div>
            </div>
          </div>

          <div className={styles["item-page__item-section"]}>
            <Image width={200} height={200} src={item.imgUrl} alt={item.name} />
            <div>
              <div className={styles["item-page__price-info"]}>
                <div></div>
                <div>
                  Latest Price: {"$"}
                  {parsedPrices[parsedPrices.length - 1].y} on{" "}
                  {parsedPrices[parsedPrices.length - 1].x} {"("}
                  {timeStrAgo}
                  {")"}
                </div>
                <div>
                  Highest Price: {"$"}
                  {highest.y} on {highest.x} {"("}
                  {timeAgo.format(new Date(highest.x))}
                  {")"}
                </div>
                <div>
                  Lowest Price: {"$"}
                  {lowest.y} on {lowest.x} {"("}
                  {timeAgo.format(new Date(lowest.x))}
                  {")"}
                </div>
              </div>
              <CategoryButton category={item.category} />
            </div>
          </div>
          <div>
            <Line
              data={data}
              options={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Unreachable code error - This works even though it is complained that it doesn't
                legend: {
                  display: true,
                  labels: {
                    fontSize: 25, //point style's size is based on font style not boxed width.
                    usePointStyle: true,
                  },
                },
                responsive: true,
              }}
            />
          </div>
        </>
      ) : (
        <h1>Item Not Found</h1>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { itemId },
}) => {
  const res = await fetch(`${API_URL}/items/${itemId}`);
  const item = await res.json();
  if (!item?.prices) {
    return {
      redirect: {
        destination: "/404",
      },
      props: {},
    };
  }

  const timeAgo = new TimeAgo("en-US");
  const latestPrice = item.prices[item.prices.length - 1].createdAt;
  const timeNumAgo = Date.now() - new Date(latestPrice).getTime();
  const timeStrAgo = timeAgo.format(new Date(latestPrice).getTime());

  return {
    props: { item, timeNumAgo, timeStrAgo },
  };
};

export default ItemPage;
