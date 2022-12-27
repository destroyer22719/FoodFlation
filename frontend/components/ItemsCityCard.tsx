import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/SearchPage.module.scss";
import ButtonContained from "./CustomButtonComponents/ButtonContained";

type Props = {
  item: {
    name: string;
    price: number;
    imgUrl: string;
    id: string;
    lastUpdated: Date;
  };
  store: {
    name: string;
    address: string;
  };
};

const ItemsCityCard: React.FC<Props> = ({ item, store }) => {
  const [date, setDate] = useState<string | null>(null);
  useState(() => {
    setDate(new Date(item.lastUpdated).toISOString().split("T")[0]);
  });

  return (
    <Link href={`/item/${item.id}`}>
      <ButtonContained>
        <div className={styles["search-page__item"]}>
          <div className={styles["search-page__item-header"]}>
            <Image
              src={`/store-logos/${store.name
                .toLocaleLowerCase()
                .replaceAll(" ", "_")}-logo.png`}
              alt={store.name}
              width={60}
              height={60}
            />
            <div>
              <h3>{item.name}</h3>
              <div>
                ${item.price} {date || ""}
              </div>
              <div>{store.address}</div>
            </div>
          </div>
          <Image
            className={styles["search-page__item-img"]}
            src={item.imgUrl}
            alt={item.name}
            width={125}
            height={125}
          />
        </div>
      </ButtonContained>
    </Link>
  );
};

export default ItemsCityCard;
