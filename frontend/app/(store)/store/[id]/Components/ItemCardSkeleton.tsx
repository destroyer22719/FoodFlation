"use client";

import styles from "@/styles/Store.module.scss";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import CategoryButtonSkeleton from "@/components/CustomButtonComponents/CategoryButtonSkeleton";

const ItemCardSkeleton = () => {
  return (
    <div className={styles["store-page__item"]}>
      <ButtonContained className={styles["store-page__item-button"]}>
        <div className={styles["store-page__item-content"]}>
          <h3 className={styles["store-page__item-name--skeleton"]}></h3>
          <div className={styles["store-page__item-image--skeleton"]}></div>
          <div className={styles["store-page__item-price--skeleton"]}></div>
          <div
            className={styles["store-page__item-last-updated--skeleton"]}
          ></div>
        </div>
      </ButtonContained>
      <CategoryButtonSkeleton className={styles["store-page__item-category"]} />
    </div>
  );
};

export default ItemCardSkeleton;
