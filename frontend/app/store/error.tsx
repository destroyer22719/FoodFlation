"use client";

import styles from "@/styles/StoreList.module.scss";

const StoreError = () => {
  return (
    <div>
      <h1 className={styles["store-list__error"]}>
        Something went wrong fetching the stores, please try again later
      </h1>
    </div>
  );
};

export default StoreError;
