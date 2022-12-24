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
  /^[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])$/;

const StoresPage: React.FC<Props> = ({ locations }) => {
  const [postalCode, setPostalCode] = useState("");
  const initialArray: boolean[] = [];
  initialArray.length = locations.length;

  const { stores, searchByCode, loading, totalStores, updateStoreList } =
    useStoreContext();

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
            value={postalCode}
            placeholder="Enter Postal Code of Store"
            onChange={(e) => {
              const input = (e.target as HTMLInputElement).value.toUpperCase();
              if (input.match(postalCodeRegex)) setPostalCode(input);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchByCode(
                  `${postalCode.slice(0, 3)} ${postalCode.slice(3)}`
                );
              }
            }}
          />
          <ButtonOutlined
            className={styles["store-list__search-button"]}
            onClick={() =>
              searchByCode(`${postalCode.slice(0, 3)} ${postalCode.slice(3)}`)
            }
          >
            <SearchIcon /> Find a Store
          </ButtonOutlined>
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
