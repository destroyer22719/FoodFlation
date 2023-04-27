import styles from "@/styles/StoreList.module.scss";
import StoreItem from "@/components/StoreItem/StoreItem";
import PaginationComponent from "./Components/PaginationComponent";


const StorePages = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const searchParamsUrl = new URLSearchParams();

  // if (searchParams?.search)
  //   searchParamsUrl.append("search", searchParams.search);
  // if (searchParams?.page) searchParamsUrl.append("page", searchParams.page);
  // if (searchParams?.city) searchParamsUrl.append("city", searchParams.city);
  // if (searchParams?.state) searchParamsUrl.append("state", searchParams.state);
  // if (searchParams?.province)
  //   searchParamsUrl.append("province", searchParams.province);
  // console.log(searchParamsUrl.toString());



  const { total: totalStores, stores } = await getStores(
  );

  const pageSize = 10;
  const maxPages = Math.ceil(totalStores / pageSize);
  const page = searchParams?.page ? +searchParams.page : 1;

  return (
    <div className={styles["store-list"]}>
      <div>
        {stores.length > 0 && (
          <PaginationComponent maxPages={maxPages} page={page} />
        )}
        <div className={styles["store-list__list"]} id="storeList">
          {stores.map((store) => (
            <StoreItem key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePages;
