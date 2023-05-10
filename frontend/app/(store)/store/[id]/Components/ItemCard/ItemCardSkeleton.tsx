import styles from "@/styles/components/ItemCard.module.scss";

const ItemCardSkeleton = () => {
  return (
    <div className={styles["item-card"]}>
      <div className={`${styles["item-card__image--skeleton"]} ${styles["item-card__image"]}`} />
      <div className={styles["item-card__info"]}>
        <div className={styles["item-card__category--skeleton"]} />
        <div className={styles["item-card__price--skeleton"]} />
      </div>
      <div className={styles["item-card__name--skeleton"]} />
      <div className={styles["item-card__last-updated--skeleton"]} />
    </div>
  );
};

export default ItemCardSkeleton;
