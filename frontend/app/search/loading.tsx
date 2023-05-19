import { Suspense } from "react";

import PaginationLoaderComponent from "@/components/Pagination/PaginationLoaderComponent";

import styles from "@/styles/pages/Search.module.scss";
import ItemCardSkeleton from "./components/ItemCard/ItemCardSkeleton";

const loading = () => {
  return (
    <div>
      <Suspense fallback={<div></div>}>
        <PaginationLoaderComponent />
      </Suspense>
      <div className={styles["search__list"]}>
        {[1, 2, 3].map((i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default loading;
