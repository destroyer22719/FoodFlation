"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "@/styles/Store.module.scss";
import CategoryButton from "@/components/CustomButtonComponents/CategoryButton";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";

type Props = {
  item: any;
};

const ItemCard: React.FC<Props> = ({ item }) => {
  const [date, setDate] = useState<string | null>(null);
  
  useEffect(() => {
    setDate(new Date(item.lastUpdated as Date).toISOString().split("T")[0]);
  }, []);

  return (
    <div className={styles["store-page__item"]}>
      <ButtonContained className={styles["store-page__item-button"]}>
        <Link href={`/item/${item.id}`}>
          <div className={styles["store-page__item-content  "]}>
            <h3>{item.name}</h3>
            <Image
              width={125}
              height={125}
              src={item.imgUrl}
              alt={`Image of ${item.name}`}
            />
            <div className={styles["store-page__item-price"]}>
              {"$"}
              {item.price}
            </div>
            <div title={`Last Updated: ${date}`}>{date}</div>
          </div>
        </Link>
      </ButtonContained>
      <CategoryButton
        category={item.category}
        className={styles["store-page__item-category"]}
        linkTo={"#"}
      />
    </div>
  );
};

export default ItemCard;
