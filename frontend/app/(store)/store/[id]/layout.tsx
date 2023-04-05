import { API_URL } from "@/config/index";
import { notFound } from "next/navigation";
import styles from "@/styles/Store.module.scss";
import SearchSection from "./Components/SearchSection";

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

//https://beta.nextjs.org/docs/data-fetching/fetching
// implemented dynamic data fetching to prevent getting {message: "Internal Server Error"} when fetching
async function getStore(id: string) {
  const storeReq = await fetch(`${API_URL}/stores/${id}`, {
    cache: "no-store",
  });
  const store = await storeReq.json();

  if (!store) {
    notFound();
  }

  return store;
}

async function getItems(id: string) {
  const itemsReq = await fetch(`${API_URL}/items/store/${id}`, {
    cache: "no-store",
  });
  const items = await itemsReq.json();

  if (!items) {
    notFound();
  }

  return items;
}

const layout = async ({ children, params }: Props) => {
  const { id } = params;

  const storeData = getStore(id);
  const itemsData = getItems(id);

  const [store, items] = await Promise.all([storeData, itemsData]);
  const { categoryData, resultsFound, total } = items;

  return (
    <div className={styles["store-page"]}>
      <h1 id="header">{store.name}</h1>
      <p>
        {store.street}, {store.city}, {store.country} |{" "}
        {store.postalCode ? store.postalCode : store.zipCode}
      </p>
      <div>{total} Items Tracked</div>
      <SearchSection resultsFound={resultsFound} categoryData={categoryData} />
      {children}
    </div>
  );
};

export default layout;
