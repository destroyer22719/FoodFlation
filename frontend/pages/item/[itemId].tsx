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
import { sortItemPricesByDate } from "../../utli";
import Image from "next/image";
import Layout from "../../components/Layout";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type dayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

const dateNumToStr = (date: number): dayOfWeek => {
    switch (date) {
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 7:
            return "Sunday";
        default:
            return "Monday";
    }
};

type AppProps = {
    item: Item;
};

type DataSet = {
    x: string;
    y: number;
};

export default function ItemPage({ item }: AppProps) {
    const { prices } = item;

    //dates
    const xDataset: string[] = [];
    //prices
    const yDataset: number[] = [];

    const highest: DataSet = { x: "", y: -Infinity };
    const lowest: DataSet = { x: "", y: Infinity };

    sortItemPricesByDate(prices).forEach(({ createdAt, price }) => {
        const date = new Date(createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });

        if (xDataset.includes(date) && yDataset.includes(price)) return;
        xDataset.push(date);
        yDataset.push(price);

        if (price > highest.y) {
            highest.y = price;
            highest.x = date;
        } else if (price < lowest.y) {
            lowest.y = price;
            lowest.x = date;
        }
    });

    const parsedPrices: DataSet[] = [];

    for (let i = 0; i < prices.length; i++) {
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
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                data: parsedPrices,
            },
        ],
    };

    return (
        <Layout title={item.name || "Item Not Found"}>
            {item.id ? (
                <>
                    <h1>{item.name}</h1>
                    <p>
                        At {item.store.street}, {item.store.city}{" "}
                        {item.store.postalCode}
                    </p>
                    <Image
                        width={200}
                        height={200}
                        src={item.imgUrl}
                        alt={item.name}
                    />
                    <div>
                        <div>
                            Latest Price: {"$"}
                            {parsedPrices[0].y} on {parsedPrices[0].x}
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
                    <div>
                        <Line
                            data={data}
                            options={{
                                scales: {
                                    // @ts-ignore - I don't know why but ts is telling me it has to be an object while it'll only work if it's an array
                                    xAxes: [
                                        {
                                            type: "time",
                                            time: {
                                                displayFormats: {
                                                    hour: "hA MMM D",
                                                },
                                                parser: "MM/DD/YYYY",
                                            },
                                        },
                                    ],
                                },
                            }}
                        />
                    </div>
                </>
            ) : (
                <h1>Item Not Found</h1>
            )}
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    query: { itemId },
}) => {
    const res = await fetch(`${API_URL}/items/${itemId}`);
    const item = await res.json();

    return {
        props: { item },
    };
};
