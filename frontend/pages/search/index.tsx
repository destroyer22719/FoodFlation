import { SelectChangeEvent } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonContained from "../../components/CustomButtonComponents/ButtonContained";
import ItemsCityCard, {
  ItemsCityCardProps,
} from "../../components/ItemsCityCard";
import Layout from "../../components/Layout";
import OrderOptions from "../../components/OrderOptions";
import SearchCityItems, {
  CityDataCAN,
  CityDataUS,
} from "../../components/SearchCityItems";
import { API_URL } from "../../config";
import styles from "../../styles/SearchPage.module.scss";

type Props = {
  items: ItemsCityCardProps[];
  citiesData: [CityDataCAN, CityDataUS];
  resultsFound?: number;
};

const SearchPage: React.FC<Props> = ({
  citiesData,
  items = [],
  resultsFound,
}) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [column, setColumn] = useState("");
  const [asc, setAscToggle] = useState(true);

  const router = useRouter();
  const { query } = router;
  const page = parseInt(query.page as string) || 1;
  const pageSize = 10;
  const maxPages = Math.ceil((resultsFound || 0) / pageSize);

  useEffect(() => {
    if (column && query.search && query.city) {
      router.push(
        `/search?search=${query.search}&city=${
          query.city
        }&page=${page}&orderBy=${column}&sortBy=${
          column === "price" ? (asc ? "asc" : "desc") : "desc"
        }`
      );
    }
  }, [column, asc]);

  function handleColumnChange(e: SelectChangeEvent) {
    setColumn(e.target.value);
  }

  function handleOrderChange() {
    console.log("pressed");
    setAscToggle(!asc);
  }

  function navigatePages(change: number) {
    router.push(
      `/search?search=${query.search}&city=${query.city}&page=${page + change}`
    );
  }

  return (
    <Layout title="Search Items">
      <h1>Search Items</h1>
      <h3>Find the price of items accross all stores in your city!</h3>
      <SearchCityItems
        search={search}
        city={city}
        setCity={setCity}
        setSearch={setSearch}
        citiesData={citiesData}
      />
      {query.search && query.city && <div>{resultsFound} Results Found</div>}
      {query.search && query.city && resultsFound && resultsFound > 0 && (
        <>
          <div>
            <OrderOptions
              column={column}
              order={asc}
              handleColumnChange={handleColumnChange}
              handleOrderChange={handleOrderChange}
            />
          </div>
          <div className={styles["search-page__pagination-buttons"]}>
            <ButtonContained
              className={styles["search-page__pagination-button"]}
              disabled={page == 1}
              onClick={() => navigatePages(-1)}
            >
              <div className={styles["search-page__pagination-button-link"]}>
                {"<"}
              </div>
            </ButtonContained>
            <ButtonContained
              className={styles["search-page__pagination-button"]}
            >
              <div className={styles["search-page__pagination-button-link"]}>
                Page {page}/{maxPages}
              </div>
            </ButtonContained>
            <ButtonContained
              className={styles["search-page__pagination-button"]}
              disabled={page == maxPages}
              onClick={() => navigatePages(1)}
            >
              <div className={styles["search-page__pagination-button-link"]}>
                {">"}
              </div>
            </ButtonContained>
          </div>
        </>
      )}
      <div className={styles["search-page__item-list"]}>
        {items.map((props) => (
          <ItemsCityCard {...props} key={props.id} />
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const req = await fetch(`${API_URL}/stores/locations`);
  const res = await req.json();
  let items = [];

  if (query?.search && query?.city) {
    const itemReq = await fetch(
      `${API_URL}/items/city/${(query.city as string).split(", ")[0]}?search=${
        query.search
      }&page=${query.page || 1}&orderBy=${query.orderBy || ""}&sortBy=${
        query.sortBy || ""
      }`
    );

    const itemRes = await itemReq.json();
    items = itemRes;
  }

  return {
    props: {
      items: items?.items || [],
      citiesData: res,
      resultsFound: items.resultsFound || null,
    },
  };
};

export default SearchPage;
