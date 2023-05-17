"use client";

import { useSearchParams } from "next/navigation";

import styles from "@/styles/pages/StoreList.module.scss";
import StoreItemSkeleton from "@/components/StoreItem/StoreItemSkeleton";
import PaginationLoaderComponent from "@/components/Pagination/PaginationLoaderComponent";

const LoadingComponent = () => {
  const searchParams = useSearchParams()!;
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

export default LoadingComponent;
