import { notFound } from "next/navigation";

import { API_URL } from "@/config/index";

import styles from "@/styles/Store.module.scss";
import ItemCard from "@/components/ItemCard";
import { CategoryData, Item, Store } from "global";
import BackToTop from "./ClientComponents/BackToTop";
import PaginationComponent from "./ClientComponents/PaginationButtons";
import SearchSection from "./ClientComponents/SearchSection";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
  };
};

const StoreIdPage = async ({
  params,
  searchParams: { page = "", category = "", search = "" },
}: Props) => {
  const { id } = params;
  const storeReq = await fetch(`${API_URL}/stores/${id}`);
  const itemsReq = await fetch(
    `${API_URL}/items/store/${id}?page=${page}&search=${search}&${
      category ? `category=${category}` : ""
    }`
  );

  const store = await storeReq.json();
  const itemData = await itemsReq.json();

  const { items, categoryData, resultsFound, total } = itemData;

  if (!store || !items) {
    notFound();
  }

  return (
    <div>
      <div className={styles["store-page"]}>
        <h1 id="header">{store.name}</h1>
        <p>
          {store.street}, {store.city}, {store.country} |{" "}
          {store.postalCode ? store.postalCode : store.zipCode}
        </p>
        <div>{total} Items Tracked</div>
        <SearchSection
          resultsFound={resultsFound}
          categoryData={categoryData}
        />
        <PaginationComponent resultsFound={resultsFound} />
        <div className={styles["store-page__item-list"]}>
          {items.length > 0 ? (
            (items as Item[]).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <div>No stores found </div>
          )}
        </div>
        {items.length >= 8 && <BackToTop />}
      </div>
    </div>
  );
};

export default StoreIdPage;
