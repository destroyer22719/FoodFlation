import styles from "@/styles/components/ItemSearchCard.module.scss";

const ItemCardSkeleton = () => {
  return (
    <div className={styles["item-card"]}>
      <div
        className={`${styles["item-card__img"]} ${styles["item-card__img--skeleton"]}`}
      />
      <div className={styles["item-card__name--skeleton"]} />
      <div className={styles["item-card__price--skeleton"]} />
      <div className={`${styles["item-card__store--skeleton"]}`}>
        <div className={styles["item-card__store-img--skeleton"]} />
        <div className={styles["item-card__store-text--skeleton"]} />
      </div>
    </div>
  );
};

export default ItemCardSkeleton;
