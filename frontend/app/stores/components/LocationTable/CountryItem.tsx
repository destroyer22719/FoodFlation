"use client";

import { useState } from "react";

import ProvItem from "./ProvItem";
import styles from "@/styles/components/LocationTable.module.scss";

type Props = {
  country: string;
  provs: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

const CountryItem: React.FC<Props> = ({ provs, country }) => {
  const [open, setOpen] = useState(false);

  const provinces = Object.keys(provs);

  return (
    <div className={styles["location-table__country"]}>
      <div
        className={styles["location-table__country-header"]}
        onClick={() => setOpen(!open)}
      >
        {country}
      </div>
      <div>
        {open && (
          <div className={styles["location-table__provinces"]}>
            {provinces.map((province) => (
              <ProvItem
                cities={provs[province]}
                province={province}
                key={province}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryItem;
