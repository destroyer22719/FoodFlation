import styles from "@/styles/StoreList.module.scss";
import StoreItem from "@/components/StoreItem/StoreItem";
import { API_URL } from "@/config/index";
import { Store } from "global";
import PaginationComponent from "@/components/PaginationComponent";
import ClientComponent from "./ClientComponent";

type searchOboject = {
  page?: string;
  province?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  city?: string;
};

const getStores = async ({
  page,
  province,
  state,
  postalCode,
  zipCode,
  city,
}: searchOboject) => {
  if (!page && !province && !state && !postalCode && !zipCode)
    return { total: 0, stores: [] };

  const storeReq = await fetch(
    `${API_URL}/stores?page=${page || 1}&province=${province || ""}&state=${
      state || ""
    }&postalCode=${postalCode || ""}&zipCode=${zipCode || ""}&city=${
      city || ""
    }`
  );
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
  const { total: totalStores, stores } = await getStores(
    searchParams as searchOboject
  );
  const pageSize = 10;
  const maxPages = Math.ceil(totalStores / pageSize);
  const page = searchParams?.page ? +searchParams.page : 1;

  return (
    <div className={styles["store-list"]}>
      <ClientComponent />
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
