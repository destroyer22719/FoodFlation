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

export default function ItemPage({ item }: AppProps) {
    const { prices } = item;
    const labels: string[] = [];
    let datasetAmt = 7;

    const parsedPrices = prices
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (dateA < dateB) return -1;
            else if (dateA > dateB) return 1;
            return 0;
        })
        .slice(0, datasetAmt)
        .map((priceObj) => {
            const date = new Date(priceObj.createdAt);
            if (!labels.includes(dateNumToStr(date.getDay())))
                labels.push(dateNumToStr(date.getDay()));
            return priceObj.price;
        });

        console.log(parsedPrices);

    const data = {
        labels,
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
        <div>
            <h1>{item.name}</h1>

            <Line data={data} />
        </div>
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
