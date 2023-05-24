import Image from "next/image";
import Link from "next/link";
import style from "@/styles/components/StoreItem.module.scss";
import { storeNameToUrl } from "@/utils/storeNameToUrl";

type Props = {
  store: Omit<Store, "country">;
};

const StoreItem: React.FC<Props> = ({ store }) => {
  return (
    <Link href={`/store/${store.id}`}>
      <div className={style["store-item"]}>
        <Image
          src={storeNameToUrl(store.name)}
          alt={store.name}
          width={80}
          height={80}
        />
        <div className={style["store-item__address"]}>
          <div>{store.street}</div>
          <div>{store.city}</div>
          <div>{store.postalCode || store.zipCode}</div>
        </div>
      </div>
    </Link>
  );
};

export default StoreItem;
