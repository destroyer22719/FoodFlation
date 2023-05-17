import Image from "next/image";
import { GetItemsFromCityQuery } from "__generated__/graphql";
import { storeNameToUrl } from "@/utils/storeNameToUrl";

import styles from "@/styles/components/ItemSearchCard.module.scss";
import Link from "next/link";

interface Props {
  item: GetItemsFromCityQuery["itemsFromCity"]["items"][0];
}

const ItemCard: React.FC<Props> = ({ item }) => {
  const { stores, imgUrl, name, prices } = item;
  return (
    <Link href={`/item/${item.id}`}>
      <div className={styles["item-card"]}>
        <div className={styles["item-card__img"]}>
          <Image src={imgUrl} alt={name} fill={true} />
        </div>
        <div className={styles["item-card__name"]}>{name}</div>
        <div>
          $ {prices[0].price} on{" "}
          {new Date(+prices[0].createdAt).toISOString().split("T")[0]}
        </div>
        <div className={styles["item-card__store"]}>
          <Image
            src={storeNameToUrl(stores.name)}
            alt={stores.name}
            width={50}
            height={50}
          />
          <div>
            <div>{stores.street}</div>
            <div>{stores.postalCode || stores.zipCode}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
