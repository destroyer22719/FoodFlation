import StoreItemSkeleton from "@/components/StoreItem/StoreItemSkeleton";
import styles from "@/styles/StoreList.module.scss";

const loading = () => {
  return (
    <div className={styles["store-list__list"]} id="storeList">
      {[1,2,3].map((id) => (
        <StoreItemSkeleton key={id} />
      ))}
    </div>
  );
};

export default loading;
