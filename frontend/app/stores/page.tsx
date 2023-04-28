import { searchStores } from "@/queries/index";
import styles from "@/styles/StoreList.module.scss";
import StoreItem from "./Components/StoreItem/StoreItem";
// import StoreItem from "@/components/StoreItem/StoreItem";
// import PaginationComponent from "./Components/PaginationComponent";
// import { searchStores } from "queries";

type Props = {
  searchParams: {
    city?: string;
    companyId?: string;
    postalCode?: string;
    zipCode?: string;
  };
};

const StorePages = async ({ searchParams }: Props) => {
  const { stores } = await searchStores(searchParams);

  return (
    <div className={styles["store-list"]}>
      <div className={styles["store-list__stores"]}>
        {stores.map((store) => (
          <StoreItem store={store} key={store.id} />
        ))}
      </div>
    </div>
  );
};

export default StorePages;
