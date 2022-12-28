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

type Props = {
  items: ItemsCityCardProps[];
  citiesData: [CityDataCAN, CityDataUS];
};

const SearchPage: React.FC<Props> = ({ citiesData, items = [] }) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  console.log(search);
  console.log(city);

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
      <div>
        {items.map(({ item, store }) => (
          <ItemsCityCard item={item} store={store} />
        ))}
      </div>
      {/* <ItemsCityCard
        item={{
          name: "Milk",
          price: 2.99,
          id: "1",
          lastUpdated: new Date(),
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a5/Glass_of_Milk_%2833657535532%29.jpg",
        }}
        store={{
          name: "Metro",
          address: "1234 Main St",
        }}
      /> */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const req = await fetch(`${API_URL}/stores/locations`);
  const res = await req.json();
  let items = [];
  if (query?.search && query?.city) {
    const itemReq = await fetch(
      `${API_URL}/items/search?search=${query.search}&city=${query.city}`
    );

    const itemRes = await itemReq.json();
    items = itemRes;
  }
  return {
    props: { items, citiesData: res },
  };
};

export default SearchPage;
