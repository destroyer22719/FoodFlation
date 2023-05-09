import { getItemsFromStore } from "@/graphql/queries";
import styles from "@/styles/Store.module.scss";
import ItemCard from "./Components/ItemCard/ItemCard";
import PaginationComponent from "@/components/Pagination/PaginationComponent";

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
  params: { id },
  searchParams: { page = "1", category, search },
}: Props) => {
  const { items, resultsFound } = await getItemsFromStore({
    id,
    page: +page || 1,
    category,
    search,
  });

  return (
    <div>
      <div className={styles["store-page__results-found--center"]}>
        <div className={styles["store-page__results-found"]}>
          {resultsFound} Results Found
        </div>
      </div>
      <PaginationComponent resultsFound={resultsFound} />
      <div className={styles["store-page__list"]}>
        {items.map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default StoreIdPage;
