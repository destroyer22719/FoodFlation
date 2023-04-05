import { Autocomplete, TextField } from "@mui/material";
import InputOutlined from "./InputOutlined";
import styles from "../styles/SearchPage.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ButtonContained from "./CustomButtonComponents/ButtonContained";

type Props = {
  city: string;
  search: string;
  setSearch: (search: string) => void;
  setCity: (city: string) => void;
  citiesData: [CityDataCAN, CityDataUS];
};

export type CityDataCAN = {
  country: string;
  storeData: {
    province: string;
    stores: {
      city: string;
      cityCount: number;
    }[];
  }[];
};

export type CityDataUS = {
  country: string;
  storeData: {
    state: string;
    stores: {
      city: string;
      cityCount: number;
    }[];
  }[];
};

const SearchCityItems: React.FC<Props> = ({
  citiesData,
  city,
  search,
  setCity,
  setSearch,
}) => {
  const router = useRouter();

  const cities: {
    label: string;
  }[] = [];

  //canada
  for (const data of citiesData[0].storeData) {
    for (const cityStoresData of data.stores) {
      cities.push({
        label: `${cityStoresData.city}, ${data.province} | ${cityStoresData.cityCount}`,
      });
    }
  }

  //usa
  for (const data of citiesData[1].storeData) {
    for (const cityStoresData of data.stores) {
      cities.push({
        label: `${cityStoresData.city}, ${data.state} | ${cityStoresData.cityCount}`,
      });
    }
  }

  return (
    <div className={styles["search-page__search-section"]}>
      <div className={styles["search-page__search-city"]}>
        <Autocomplete
          options={cities}
          onChange={(e, v) => setCity(v?.label.split(" | ")[0] || "")}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select a City" />
          )}
        />
      </div>
      <InputOutlined
        className={styles["search-page__search-item"]}
        disabled={!city}
        value={search}
        onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        placeholder={"Search for an item"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(`/search?city=${city}&search=${search}`);
          }
        }}
      />
      {search && (
        <>
          <Link href={`/search?city=${city}&search=${search}`}>
            <ButtonContained className={styles["search-page__search-button"]}>
              <SearchIcon />
            </ButtonContained>
          </Link>
        </>
      )}
    </div>
  );
};

export default SearchCityItems;
