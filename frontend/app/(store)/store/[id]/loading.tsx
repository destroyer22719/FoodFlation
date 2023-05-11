import PaginationLoaderComponent from "@/components/Pagination/PaginationLoaderComponent";
import styles from "@/styles/pages/Store.module.scss";
import ItemCardSkeleton from "./Components/ItemCard/ItemCardSkeleton";

const Loading = () => {
  return (
    <div>
      <PaginationLoaderComponent />
      <div className={styles["store-page__list"]}>
        <>
          {[1, 2, 3, 4].map((val) => (
            <ItemCardSkeleton key={val} />
          ))}
        </>
      </div>
    </div>
  );
};

export default Loading;
