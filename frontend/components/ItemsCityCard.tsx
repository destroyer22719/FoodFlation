import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/SearchPage.module.scss";
import ButtonContained from "./CustomButtonComponents/ButtonContained";

export type ItemsCityCardProps = {
  name: string;
  price: number;
  imgUrl: string;
  id: string;
  lastUpdated: Date;
  street: string;
  storeName: string;
};

const ItemsCityCard: React.FC<ItemsCityCardProps> = ({
  name,
  price,
  imgUrl,
  id,
  lastUpdated,
  street,
  storeName,
}) => {
  const [date, setDate] = useState<string | null>(null);
  useState(() => {
    setDate(new Date(lastUpdated).toISOString().split("T")[0]);
  });

  return (
    <Link href={`/item/${id}`}>
      <ButtonContained className={styles["search-page__item"]}>
          <h3>{name}</h3>
          <div className={styles["search-page__item-header"]}>
            <Image
              src={`/store-logos/${storeName
                .toLocaleLowerCase()
                .replaceAll(" ", "_")}-logo.png`}
              alt={storeName}
              width={60}
              height={60}
              className={styles["search-page__item-header-logo"]}
            />
            <div>
              <div>
                ${price} {date || ""}
              </div>
              <div>{street}</div>
            </div>
          </div>
          <Image
            className={styles["search-page__item-img"]}
            src={imgUrl}
            alt={name}
            width={125}
            height={125}
          />
      </ButtonContained>
    </Link>
  );
};

export default ItemsCityCard;
