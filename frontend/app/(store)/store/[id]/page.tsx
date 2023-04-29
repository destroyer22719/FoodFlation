import { notFound } from "next/navigation";

// import { API_URL } from "@/config/index";
import styles from "@/styles/Store.module.scss";
import ItemCard from "@/components/ItemCard";

import BackToTop from "./Components/BackToTop";
import PaginationComponent from "./Components/PaginationButtons";

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
  // const { id } = params;

  // const queryParamsUrl = new URLSearchParams({
  //   page: page || "1",
  // });

  // if (category) queryParamsUrl.append("category", category);
  // if (search) queryParamsUrl.append("search", search);

  // const itemsReq = await fetch(
  //   `${API_URL}/items/store/${id}?${queryParamsUrl.toString()}`,
  //   {
  //     cache: "no-store",
  //   }
  // );

  // const itemData: ItemFetchRes = await itemsReq.json();
  // const { items, resultsFound } = itemData;

  // if (!items) {
  //   notFound();
  // }

  return (
    <div>
      {/* <PaginationComponent resultsFound={resultsFound} />
      <div className={styles["store-page__item-list"]}>
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <h2>No Items Found </h2>
        )}
      </div>
      {items.length >= 8 && <BackToTop />} */}
    </div>
  );
};

export default StoreIdPage;
