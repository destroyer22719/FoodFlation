"use client";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "@/styles/StoreList.module.scss";
import ButtonOutlined from "@/components/CustomButtonComponents/ButtonOutlined";
import InputOutlined from "@/components/InputOutlined";

// export type Country = "Canada" | "United States";

// export type CityData = {
//   city: string;
//   cityCount: number;
// };

// export type StoreData = {
//   state?: string;
//   province?: string;
//   stores: CityData[];
// };

// export type Location = {
//   country: Country;
//   storeData: StoreData[];
// };

const SearchStore = () => {
  const [codeInput, setCodeInput] = useState("");

  return (
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
      <ButtonOutlined className={styles["store-list__search-button"]}>
        <SearchIcon /> Find a Store
      </ButtonOutlined>
    </div>
  );
};

export default SearchStore;
