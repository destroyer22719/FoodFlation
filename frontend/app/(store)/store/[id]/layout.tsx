import { getStoreData } from "@/graphql/queries";
import CategoriesList from "./Components/CategoriesList";
import { notFound } from "next/navigation";
import StoreItem from "@/components/StoreItem/StoreItem";
import styles from "@/styles/Store.module.scss";
import SearchItems from "./Components/SearchItems";

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const Layout = async ({ params, children }: Props) => {
  const { id } = params;
  const { store, itemsFromStore } = await getStoreData(id);

  if (!store) {
    notFound();
  }

  return (
    <div className={styles["store-page"]}>
      <StoreItem store={store as Store} />
      <SearchItems />
      <CategoriesList categoriesData={itemsFromStore.categories} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
