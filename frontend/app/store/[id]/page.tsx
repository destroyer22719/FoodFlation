import { notFound } from "next/navigation";

import { API_URL } from "@/config/index";

import styles from "@/styles/Store.module.scss";
import ItemCard from "@/components/ItemCard";
import { Item } from "global";
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

  const queryParamsUrl = new URLSearchParams({
    page: page || "1",
  });

  if (category) queryParamsUrl.append("category", category);
  if (search) queryParamsUrl.append("search", search);

  const itemsReq = await fetch(
    `${API_URL}/items/store/${id}?${queryParamsUrl.toString()}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );

  const itemData = await itemsReq.json();

  const { items } = itemData;

  if (!items) {
    notFound();
  }

  return (
    <div>
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
