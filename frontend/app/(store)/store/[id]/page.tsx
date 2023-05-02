import { getItemsFromStore } from "@/queries/index";
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
  params,
  searchParams: { page = "", category = "", search = "" },
}: Props) => {
  const { id } = params;

  const { items, resultsFound } = await getItemsFromStore(id, {
    page: +page || 1,
    category,
    search,
  });

  return (
    <div>
      <div>{resultsFound} Results Found</div>
      <PaginationComponent resultsFound={resultsFound}/>
      <div>
        {items.map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default StoreIdPage;
