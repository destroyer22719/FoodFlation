import { GetServerSideProps } from "next";
import { useState } from "react";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreItem";
import { API_URL } from "../../config";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../../styles/StoreList.module.scss";
import ButtonContained from "../../components/CustomButtonComponents/ButtonContained";
import ButtonOutlined from "../../components/CustomButtonComponents/ButtonOutlined";
import { CircularProgress } from "@mui/material";
import InputOutlined from "../../components/InputOutlined";
import LocationTable from "../../components/LocationTableComponents/LocationTable";
import { useStoreContext } from "../../providers/storeContext";

type Props = {
  locations: Location[];
};

export type Country = "Canada" | "United States";

export type CityData = {
  city: string;
  cityCount: number;
};

export type StoreData = {
  state?: string;
  province?: string;
  stores: CityData[];
};

export type Location = {
  country: Country;
  storeData: StoreData[];
};

const postalCodeRegex =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/;

const zipCodeRegex = /^\d{5}/;

const StoresPage: React.FC<Props> = ({ locations }) => {
  const [codeInput, setCodeInput] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [searched, setSearched] = useState(false);
  const initialArray: boolean[] = [];
  initialArray.length = locations.length;

  const { stores, searchByCode, loading, totalStores, updateStoreList } =
    useStoreContext();

  function handleSearchCode(input: string) {
    if (postalCodeRegex.test(input)) {
      searchByCode(input);
    } else if (zipCodeRegex.test(input)) {
      searchByCode(input, true);
    }
  }
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const maxPages = Math.ceil(totalStores / pageSize);

  const navigatePages = (pageChange: number) => {
    if (pageChange < 0 && page === 1) {
      return;
    } else if (pageChange > 0 && page === maxPages) {
      return;
    }

    updateStoreList({
      changePage: true,
      pageInc: pageChange,
    });

    setPage(page + pageChange);
  };

  return (
    <Layout title="Store List">
      <div className={styles["store-list"]}>
        <div className={styles["store-list__search"]}>
          <InputOutlined
            className={styles["store-list__search-bar"]}
            value={codeInput}
            placeholder="A1A 1A1 or 12345"
            onChange={(e) => {
              setCodeInput((e.target as HTMLInputElement).value.toUpperCase());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearched(true);
                handleSearchCode(codeInput);
              }
            }}
          />
          <ButtonOutlined
            className={styles["store-list__search-button"]}
            onClick={() => {
              setSearched(true);
              handleSearchCode(codeInput);
            }}
          >
            <SearchIcon /> Find a Store
          </ButtonOutlined>
          {searched && <div>{stores.length} Results Found</div>}
        </div>
        <LocationTable locations={locations} />
        {stores.length > 0 && (
          <div className={styles["store-list__pagination-buttons"]}>
            <ButtonContained
              className={styles["store-list__pagination-button"]}
              disabled={page == 1}
              onClick={() => navigatePages(-1)}
            >
              <div className={styles["store-list__pagination-button-link"]}>
                {"<"}
              </div>
            </ButtonContained>
            <ButtonContained
              className={styles["store-list__pagination-button"]}
            >
              <div className={styles["store-list__pagination-button-link"]}>
                Page {page}/{maxPages}
              </div>
            </ButtonContained>
            <ButtonContained
              className={styles["store-list__pagination-button"]}
              disabled={page == maxPages}
              onClick={() => navigatePages(1)}
            >
              <div className={styles["store-list__pagination-button-link"]}>
                {">"}
              </div>
            </ButtonContained>
          </div>
        )}
        {loading ? (
          <div className={styles["store-list__loader"]}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles["store-list__list"]} id="storeList">
            {stores.map((store) => (
              <StoreList key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const locationRes = await fetch(`${API_URL}/stores/locations`);
  const locations = await locationRes.json();

  return {
    props: {
      locations,
    },
  };
};

export default StoresPage;
