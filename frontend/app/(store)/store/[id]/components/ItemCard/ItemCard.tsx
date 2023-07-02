import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/components/ItemCard.module.scss";

type Props = {
  item: Omit<Item, "createdAt" | "updatedAt" | "storeId">;
};

const ItemCard = ({ item }: Props) => {
  const { category, id, imgUrl, name, prices, unit } = item;

  if (prices.length === 0) {
    return <></>;
  }

  const price = prices[0].price;
  const lastUpdated = new Date(+prices[0].createdAt).toLocaleDateString();

  return (
    <Link href={`/item/${id}`}>
      <div className={styles["item-card"]}>
        <Image alt={name} height={250} width={250} src={imgUrl} className={styles["item-card__image"]} />
        <div className={styles["item-card__info"]}>
          <CategoryIcon category={category} />
          <div className={styles["item-card__price"]}>
            <div>
              $ {price} / {unit || "unit"}
            </div>
          </div>
        </div>
        <h3>{name}</h3>
        <div className={styles["item-card__date"]}>{lastUpdated}</div>
      </div>
    </Link>
  );
};

export default ItemCard;
