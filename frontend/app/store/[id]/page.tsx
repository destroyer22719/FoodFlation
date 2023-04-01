import { notFound } from "next/navigation";

import { API_URL } from "@/config/index";

import styles from "@/styles/Store.module.scss";
import ItemCard from "@/components/ItemCard";
import { Item } from "global";
import BackToTop from "./ClientComponents/BackToTop";
import PaginationComponent from "./ClientComponents/PaginationButtons";
import SearchSection from "./ClientComponents/SearchSection";
import { ItemFetchRes } from "./util";

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

  const itemsReq = await fetch(
    `${API_URL}/items/store/${id}?page=${page}&search=${search}${
      category ? `&category=${category}` : ""
    }`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );

  const itemData: ItemFetchRes = await itemsReq.json();
  const { items, total, resultsFound, categoryData } = itemData;

  if (!items) {
    console.log(itemData);
    notFound();
  }

  return (
    <div>
      <PaginationComponent resultsFound={resultsFound} />
      <div className={styles["store-page__item-list"]}>
        {items.length > 0 ? (
          (items as Item[]).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <div>No Items Found </div>
        )}
      </div>
      {items.length >= 8 && <BackToTop />}
    </div>
  );
};

export default StoreIdPage;
