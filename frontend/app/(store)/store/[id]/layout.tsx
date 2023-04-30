import { getStoreData } from "@/queries/index";
import StoreInfo from "./Components/StoreInfo";
import Categories from "./Components/Categories";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const Layout = async ({ params }: Props) => {
  const { id } = params;
  const { store, itemsFromStore } = await getStoreData(id);

  if (!store) {
    notFound();
  }

  return (
    <div>
      <StoreInfo store={store} />
      <Categories categoriesData={itemsFromStore.categories} />
    </div>
  );
};

export default Layout;
