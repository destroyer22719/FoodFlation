"use client";

import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { DataSet } from "../page";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

ChartJS.defaults.font.size = 20;
ChartJS.defaults.font.weight = "bold";
ChartJS.defaults.color = "white";

const ChartComponent = ({ pricesData, unit="unit" }: { pricesData: DataSet[]; unit?: string }) => {
  const data = {
    label: "Date",
    datasets: [
      {
        label: `Price per ${unit}`,
        fill: true,
        borderColor: "rgb(255,255,255)",
        data: pricesData,
        borderWidth: 5,
      },
    ],
  };

  return (
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
  );
};

export default ChartComponent;
