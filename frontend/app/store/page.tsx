import styles from "@/styles/StoreList.module.scss";
import StoreItem from "@/components/StoreItem/StoreItem";
import { API_URL } from "@/config/index";
import { Store } from "global";
import PaginationComponent from "./ClientComponents/PaginationComponent";

const getStores = async (searchParams: string) => {
  if (!searchParams) return { total: 0, stores: [] };

  const storeReq = await fetch(`${API_URL}/stores?${searchParams}`);
  const storeRes = (await storeReq.json()) as {
    total: number;
    stores: Store[];
  };

  return storeRes;
};

const StorePages = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const searchParamsUrl = new URLSearchParams();

  for (const key in searchParams) {
    if (searchParams[key]) {
      searchParamsUrl.append(key, searchParams[key]!);
    }
  }

  const { total: totalStores, stores } = await getStores(
    searchParamsUrl.toString()
  );

  const pageSize = 10;
  const maxPages = Math.ceil(totalStores / pageSize);
  const page = searchParams?.page ? +searchParams.page : 1;

  return (
    <div className={styles["store-list"]}>
      <div>
        {stores.length > 0 && (
          <PaginationComponent maxPages={maxPages} page={page} />
        )}
        <div className={styles["store-list__list"]} id="storeList">
          {stores.map((store) => (
            <StoreItem key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePages;
