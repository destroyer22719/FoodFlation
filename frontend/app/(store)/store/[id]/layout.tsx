import { getStoreData } from "@/graphql/queries";
import CategoriesList from "./components/CategoriesList";
import { notFound } from "next/navigation";
import StoreItem from "@/components/StoreItem/StoreItem";
import styles from "@/styles/pages/Store.module.scss";
import SearchItems from "./components/SearchItems";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const { store } = await getStoreData(id);

  if (!store) {
    notFound();
  }

  return {
    title: `FoodFlation | ${store.name}`,
  };
}

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
