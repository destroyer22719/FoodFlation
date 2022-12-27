import { useState } from "react";
import InputOutlined from "../../components/InputOutlined";
import ItemsCityCard from "../../components/ItemsCityCard";
import Layout from "../../components/Layout";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  return (
    <Layout title="Search Items">
      <h1>Search Items</h1>
      <h3>Find the price of items accross all stores in your city!</h3>
      <ItemsCityCard
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
      />
    </Layout>
  );
};

export default SearchPage;
