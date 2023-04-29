// import StoreItemSkeleton from "@/components/StoreItem/StoreItemSkeleton";
import styles from "@/styles/StoreList.module.scss";
import StoreItemSkeleton from "./Components/StoreItem/StoreItemSkeleton";
import PaginationLoaderComponent from "@/components/Pagination/PaginationLoaderComponent";

const loading = () => {
  return (
    <div className={styles["store-list__stores"]} id="list">
      <PaginationLoaderComponent />
      {[1, 2, 3, 4].map((id) => (
        <StoreItemSkeleton key={id} />
      ))}
    </div>
  );
};

export default loading;
