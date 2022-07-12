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
import ButtonOutlined from "../../components/ButtonOutlined";
import Link from "next/link";
import { useRouter } from "next/router";

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
};

type DataSet = {
    x: string;
    y: number;
};

ChartJS.defaults.font.size = 20;
ChartJS.defaults.font.weight = "bold";
ChartJS.defaults.color = "white";

const ItemPage: React.FC<Props> = ({ item }) => {
    const { prices } = item;
    const router = useRouter();
    //dates
    const xDataset: string[] = [];
    //prices
    const yDataset: number[] = [];

    const highest: DataSet = { x: "", y: -Infinity };
    const lowest: DataSet = { x: "", y: Infinity };

    prices!.forEach(({ createdAt, price }, i) => {
        const date = new Date(createdAt).toISOString().split("T")[0];

        let dupeIndex = xDataset.indexOf(date);

        if (
            dupeIndex !== -1 &&
            yDataset[dupeIndex] === price //check if the dataset already has this date and price
        )
            return;
        if ( dupeIndex !== -1 && xDataset[dupeIndex] === date) {
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

    for (let i = 0; i < yDataset!.length; i++) {
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
                            <ButtonOutlined
                                className={styles["item-page__back-button"]}
                            >
                                {"<"}
                            </ButtonOutlined>
                        </div>
                        <div>
                            <h1>{item.name}</h1>
                            <p>
                                {item.store.street}, {item.store.city}{" "}
                                {item.store.postalCode}
                            </p>
                        </div>
                    </div>

                    <div className={styles["item-page__item-section"]}>
                        <Image
                            width={200}
                            height={200}
                            src={item.imgUrl}
                            alt={item.name}
                        />
                        <div>
                            <div>
                                Latest Price: {"$"}
                                {
                                    parsedPrices[parsedPrices.length - 1].y
                                } on {parsedPrices[parsedPrices.length - 1].x}
                            </div>
                            <div>
                                Highest Price: {"$"}
                                {highest.y} on {highest.x}
                            </div>
                            <div>
                                Lowest Price: {"$"}
                                {lowest.y} on {lowest.x}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Line
                            
                            data={data}
                            options={{
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

    return {
        props: { item },
    };
};

export default ItemPage;
