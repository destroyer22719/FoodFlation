"use client";

import style from "@/styles/Components/StoreItem.module.scss";

const StoreItemSkeleton = () => {
  return (
    <div className={style["store-item"]}>
      <div className={style["store-item__image--skeleton"]}></div>
      <div className={style["store-item__address--skeleton"]}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default StoreItemSkeleton;
