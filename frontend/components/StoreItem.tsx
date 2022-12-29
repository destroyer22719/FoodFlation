import Image from "next/image";
import Link from "next/link";
import { Store } from "../global";
import ButtonContained from "./CustomButtonComponents/ButtonContained";
import style from "../styles/StoreList.module.scss";

type Props = {
  store: Store;
};

const StoreItem: React.FC<Props> = ({ store }) => {
  return (
    <div className={style["store-list__store-item"]}>
      <ButtonContained className={style["store-list__store-item-btn"]}>
        <Link href={`/store/${store.id}`}>
          <div className={style["store-list__store-item--format"]}>
            <Image
              src={`/store-logos/${store.name
                .toLocaleLowerCase()
                .replaceAll(" ", "_")}-logo.png`}
              alt={store.name}
              width={80}
              height={80}
            />
            <div className={style["store-list__store-item-address"]}>
              <span>{store.street}</span>
              <span>{store.city}</span>
              <span>{store.postalCode || store.zipCode}</span>
            </div>
          </div>
        </Link>
      </ButtonContained>
    </div>
  );
};

export default StoreItem;
