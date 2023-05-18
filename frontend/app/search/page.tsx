import PaginationComponent from "@/components/Pagination/PaginationComponent";
import { getItemsFromCity } from "@/graphql/queries";
import { Suspense } from "react";
import ItemCard from "./components/ItemCard/ItemCard";

import styles from "@/styles/pages/Search.module.scss";

type SearchParams = {
  city?: string;
  search?: string;
  page?: string;
  sortByPrice?: string;
  sortByAsc?: string;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { city, search, page, sortByAsc, sortByPrice } = searchParams;

  const { resultsFound, items } = await getItemsFromCity({
    city,
    search,
    page: page !== undefined ? +page : 1,
    sortByAsc: sortByAsc === "true",
    sortByPrice: sortByPrice === "true",
  });

  return (
    <div>
      {resultsFound > 0 && (
        <Suspense fallback={<div></div>}>
          <PaginationComponent resultsFound={resultsFound} />
        </Suspense>
      )}
      <div className={styles["search__list"]}>
        {items.map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Page;
