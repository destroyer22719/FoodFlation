import { getStoreData } from "@/graphql/queries";
import CategoriesList from "./Components/CategoriesList";
import { notFound } from "next/navigation";
import StoreItem from "@/components/StoreItem/StoreItem";

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
    <div>
      <StoreItem store={store as Store} />
      <CategoriesList categoriesData={itemsFromStore.categories} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
