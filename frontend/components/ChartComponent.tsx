// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     ChartData,
//     ScatterDataPoint,
//     ElementChartOptions,
// } from "chart.js";

// import zoomPlugin from "chartjs-plugin-zoom";
// import { Line } from "react-chartjs-2";

// type Props = {
//     data: ChartData<"line", (number | ScatterDataPoint | null)[], unknown>;
//     options: ElementChartOptions<"line">;
// };

// ChartJS.defaults.font.size = 20;
// ChartJS.defaults.font.weight = "bold";
// ChartJS.defaults.color = "white";

// const ChartComponent: React.FC<Props> = ({ data, options }) => {
//     ChartJS.register(
//         CategoryScale,
//         LinearScale,
//         PointElement,
//         LineElement,
//         Title,
//         Tooltip,
//         Legend,
//         zoomPlugin
//     );

//     return <Line data={data} options={options} />;
// };

// export default ChartComponent;
