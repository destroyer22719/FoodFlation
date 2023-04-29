// import { CategoryData, Item } from "global";

// export const newUrl = (path: string, key: string, value: string) => {
//   const regex = new RegExp(`(?<=${key}=)[^&]+`);
//   if (path.match(regex)) {
//     return path.replace(regex, `${value}`);
//   } else if (path.indexOf("&") !== -1) {
//     return `${path}&${key}=${value}`;
//   } else if (path[path.length - 1] === "?") {
//     return `${path}${key}=${value}`;
//   }
//   return `${path}?${key}=${value}`;
// };

// export type ItemFetchRes = {
//   items: Item[];
//   total: number;
//   resultsFound: number;
//   categoryData: CategoryData[];
// };
