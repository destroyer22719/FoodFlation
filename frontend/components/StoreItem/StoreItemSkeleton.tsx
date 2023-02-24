"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import style from "@/styles/StoreList.module.scss";

const StoreItem: React.FC<{}> = () => {
  return (
    <div className={style["store-list__store-item"]}>
      <ButtonContained className={style["store-list__store-item-btn"]}>
          <div className={style["store-list__store-item--format"]}>
            <div></div>
            <div className={style["store-list__store-item-address"]}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
      </ButtonContained>
    </div>
  );
};

export default StoreItem;
