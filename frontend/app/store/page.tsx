"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import styles from "@/styles/StoreList.module.scss";
import StoreItem from "@/components/StoreItem";
import { API_URL } from "@/config/index";
import { Store } from "global";
import { use } from "react";

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

const StorePage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const { total: totalStores, stores } = use(
    getStores(searchParams as searchOboject)
  );
  
  const pageSize = 10;
  const maxPages = Math.ceil(totalStores / pageSize);
  const page = searchParams?.page ? +searchParams.page : 1;

  return (
    <div>
      {stores.length > 0 && (
        <div className={styles["store-list__pagination-buttons"]}>
          <ButtonContained
            className={styles["store-list__pagination-button"]}
            disabled={page == 1}
            onClick={() => {}}
          >
            <div className={styles["store-list__pagination-button-link"]}>
              {"<"}
            </div>
          </ButtonContained>
          <ButtonContained className={styles["store-list__pagination-button"]}>
            <div className={styles["store-list__pagination-button-link"]}>
              Page {page}/{maxPages}
            </div>
          </ButtonContained>
          <ButtonContained
            className={styles["store-list__pagination-button"]}
            disabled={page == maxPages}
            onClick={() => {}}
          >
            <div className={styles["store-list__pagination-button-link"]}>
              {">"}
            </div>
          </ButtonContained>
        </div>
      )}
      <div className={styles["store-list__list"]} id="storeList">
        {stores.map((store) => (
          <StoreItem key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default StorePage;
