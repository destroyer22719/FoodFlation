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
        <Link
          href={`/store/${store.id}`}
          className={style["store-list__store-item--format"]}
        >
          <>
            <div className={style["store-list__store-item-image"]}>
              <Image
                src={`/store-logos/${store.name
                  .toLocaleLowerCase()
                  .replaceAll(" ", "_")}-logo.png`}
                alt={store.name}
                layout="fill"
              />
            </div>
            <div className={style["store-list__store-item-address"]}>
              <span>{store.street}</span>
              <span>{store.city}</span>
              <span>{store.postalCode}</span>
            </div>
          </>
        </Link>
      </ButtonContained>
    </div>
  );
};

export default StoreItem;
