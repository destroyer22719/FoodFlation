"use client";

import { useEffect, useState } from "react";

import styles from "@/styles/pages/Index.module.scss";

type Props = {
  itemTotal: number;
  storeTotal: number;
};

const Stats: React.FC<Props> = ({ itemTotal, storeTotal }) => {
  const [itemCount, setItemCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setItemCount((prevNum) => {
        if (prevNum < itemTotal) {
          if (itemTotal - prevNum > 500) {
            return prevNum + 500;
          } else if (itemTotal - prevNum > 100) {
            return prevNum + 100;
          } else if (itemTotal - prevNum > 10) {
            return prevNum + 10;
          }
          return prevNum + 1;
        }
        return itemTotal;
      });
      setStoreCount((prevNum) =>
        prevNum < storeTotal ? prevNum + 1 : storeTotal
      );
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles["home__stats"]}>
      <div className={styles["home__stat"]}>{itemCount} items</div>
      <div className={styles["home__stat"]}>{storeCount} stores</div>
    </div>
  );
};

export default Stats;
