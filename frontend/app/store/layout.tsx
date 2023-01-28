"use client";

import { use, useState } from "react";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import SearchIcon from "@mui/icons-material/Search";
import styles from "@/styles/StoreList.module.scss";
import ButtonOutlined from "@/components/CustomButtonComponents/ButtonOutlined";
import InputOutlined from "@/components/InputOutlined";
import LocationTable from "@/components/LocationTableComponents/LocationTable";

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

const getLocations = async () => {
  const locationRes = await fetch(`${API_URL}/stores/locations`);
  const locations = await locationRes.json();
  return locations as Location[];
};

// quick fix to sending infinite fetch api requests
// https://github.com/vercel/next.js/issues/42265#issuecomment-1305260064
const getLocationsCache = getLocations();

const StoresPage: React.FC<{ children: React.Component }> = ({ children }) => {
  const [codeInput, setCodeInput] = useState("");
  const locations = use(getLocationsCache);

  return (
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
            }
          }}
        />
        <ButtonOutlined
          className={styles["store-list__search-button"]}
          onClick={() => {}}
        >
          <SearchIcon /> Find a Store
        </ButtonOutlined>
      </div>
      <LocationTable locations={locations} />
      <>{children}</>
    </div>
  );
};

export default StoresPage;