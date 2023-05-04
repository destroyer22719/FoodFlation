import { searchStores } from "@/queries/index";
import styles from "@/styles/StoreList.module.scss";
import StoreItem from "./Components/StoreItem/StoreItem";
import PaginationComponent from "@/components/Pagination/PaginationComponent";
import StoreItemSkeleton from "./Components/StoreItem/StoreItemSkeleton";
// import StoreItem from "@/components/StoreItem/StoreItem";
// import PaginationComponent from "./Components/PaginationComponent";
// import { searchStores } from "queries";

type Props = {
  searchParams: {
    city?: string;
    companyId?: string;
    postalCode?: string;
    zipCode?: string;
    page?: number;
  };
};

const StorePages = async ({ searchParams }: Props) => {
  const { city, companyId, postalCode, zipCode, page } = searchParams;
  const { stores, total } = await searchStores({
    city,
    companyId,
    postalCode,
    zipCode,
    page: page !== undefined ? +page : 1,
  });

  return (
    <div className={styles["store-list"]}>
      <div>{total > 0 && <PaginationComponent resultsFound={total} />}</div>
      <div className={styles["store-list__stores"]} id="list">
        {stores.map((store) => (
          <StoreItem store={store} key={store.id} />
        ))}
      </div>
    </div>
  );
};

export default StorePages;
