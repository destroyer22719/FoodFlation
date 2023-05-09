"use client";

import { useSearchParams } from "next/navigation";

import styles from "@/styles/StoreList.module.scss";
import StoreItemSkeleton from "../../components/StoreItem/StoreItemSkeleton";
import PaginationLoaderComponent from "@/components/Pagination/PaginationLoaderComponent";

const Loading = () => {
  const searchParams = useSearchParams();
  const searchQueryExists = !!searchParams.toString();

  return (
    <div>
      {searchQueryExists && (
        <div className={styles["store-list__stores"]} id="list">
          <PaginationLoaderComponent />
          {[1, 2, 3, 4].map((id) => (
            <StoreItemSkeleton key={id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Loading;
