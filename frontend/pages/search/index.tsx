import { GetServerSideProps } from "next";
import { useState } from "react";
import ItemsCityCard, {
  ItemsCityCardProps,
} from "../../components/ItemsCityCard";
import Layout from "../../components/Layout";
import SearchCityItems, {
  CityDataCAN,
  CityDataUS,
} from "../../components/SearchCityItems";
import { API_URL } from "../../config";
import styles from "../../styles/SearchPage.module.scss";

type Props = {
  items: ItemsCityCardProps[];
  citiesData: [CityDataCAN, CityDataUS];
};

const SearchPage: React.FC<Props> = ({ citiesData, items = [] }) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);

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
      }`
    );

    const itemRes = await itemReq.json();
    items = itemRes;
  }

  return {
    props: { items: items.items, citiesData: res },
  };
};

export default SearchPage;
