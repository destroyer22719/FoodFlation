import { getStoreData } from "@/queries/index";
import StoreInfo from "./Components/StoreInfo";
import Categories from "./Components/Categories";
import { notFound } from "next/navigation";

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
      <StoreInfo store={store} />
      <Categories categoriesData={itemsFromStore.categories} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
