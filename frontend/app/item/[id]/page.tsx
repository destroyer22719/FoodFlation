// import Image from "next/image";

// import { API_URL } from "@/config/index";
// import { Item } from "global";
// import CategoryButton from "@/components/CustomButtonComponents/CategoryButton";
// import BackButton from "./ClientComponents/BackButton";
// import { DataSet } from "./util";
// import ChartComponent from "./ClientComponents/ChartComponent";

// import styles from "@/styles/Item.module.scss";
// import timeAgo from "util/timeAgo";

// type Props = {
//   params: { id: string };
// };

// const ItemPage = async ({ params }: Props) => {
//   const { id } = params;

//   const req = await fetch(`${API_URL}/items/${id}`);
//   const item: Item = await req.json();

//   const { prices } = item;
//   //dates
//   const xDataset: string[] = [];
//   //prices
//   const yDataset: number[] = [];

//   const highest: DataSet = { x: "", y: -Infinity };
//   const lowest: DataSet = { x: "", y: Infinity };

//   prices.forEach(({ createdAt, price }) => {
//     const date = new Date(createdAt).toISOString().split("T")[0];

//     const dupeIndex = xDataset.indexOf(date);

//     if (
//       dupeIndex !== -1 &&
//       yDataset[dupeIndex] === price //check if the dataset already has this date and price
//     )
//       return;
//     if (dupeIndex !== -1 && xDataset[dupeIndex] === date) {
//       //remove the previous dataset with the same date, so this the graph gets the latest price of that day
//       yDataset.splice(dupeIndex, 1);
//       xDataset.splice(dupeIndex, 1);
//     }

//     xDataset.push(date);
//     yDataset.push(price);

//     if (price > highest.y) {
//       highest.y = price;
//       highest.x = date;
//     }
//     if (price < lowest.y) {
//       lowest.y = price;
//       lowest.x = date;
//     }
//   });

//   const parsedPrices: DataSet[] = [];

//   for (let i = 0; i < yDataset.length; i++) {
//     parsedPrices.push({
//       x: xDataset[i],
//       y: yDataset[i],
//     });
//   }

//   const lastUpdated = new Date(parsedPrices[parsedPrices.length - 1].x);
//   const greaterThanTwoWeeks = Date.now() - lastUpdated.getTime() > 12096e5;

//   return (
//     <>
//       <div className={styles["item-page__header"]}>
//         <BackButton />
//         <div className={styles["item-page__header-metada"]}>
//           <div>
//             <h1>{item.name}</h1>
//           </div>
//           {greaterThanTwoWeeks && (
//             <h3>
//               Warning: Price may be outdated as it is from{" "}
//               {timeAgo(lastUpdated)}
//             </h3>
//           )}
//           <div>
//             <p>
//               {item.store.street}, {item.store.city} {item.store.postalCode}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className={styles["item-page__item-section"]}>
//         <Image width={200} height={200} src={item.imgUrl} alt={item.name} />
//         <div>
//           <div className={styles["item-page__price-info"]}>
//             <div></div>
//             <div>
//               Latest Price: {"$"}
//               {parsedPrices[parsedPrices.length - 1].y} on
//               {parsedPrices[parsedPrices.length - 1].x} {"("}
//               {timeAgo(lastUpdated)}
//               {")"}
//             </div>
//             <div>
//               Highest Price: {"$"}
//               {highest.y} on {highest.x} {"("}
//               {timeAgo(new Date(highest.x))}
//               {")"}
//             </div>
//             <div>
//               Lowest Price: {"$"}
//               {lowest.y} on {lowest.x} {"("}
//               {timeAgo(new Date(lowest.x))}
//               {")"}
//             </div>
//           </div>
//           <CategoryButton category={item.category} />
//         </div>
//       </div>
//       <div>
//         <ChartComponent pricesData={parsedPrices} />
//       </div>
//     </>
//   );
// };

// export default ItemPage;


const page = () => {
  return (
    <div>page</div>
  )
}

export default page