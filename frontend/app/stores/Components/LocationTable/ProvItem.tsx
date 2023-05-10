import Link from "next/link";
import { useState } from "react";

import styles from "@/styles/components/LocationTable.module.scss";

type Props = {
  province: string;
  cities: {
    [key: string]: number;
  };
};

const ProvItem: React.FC<Props> = ({ cities, province }) => {
  const [open, setOpen] = useState(false);
  const cityNames = Object.keys(cities);

  return (
    <div className={styles["location-table__province"]}>
      <div
        onClick={() => setOpen(!open)}
        className={styles["location-table__province--header"]}
      >
        {province}
      </div>
      <div>
        {open && (
          <div className={styles["location-table__cities"]}>
            {cityNames.map((cityName) => (
              <Link href={`/stores/?city=${cityName}#list`} key={cityName}>
                <div className={styles["location-table__city"]}>
                  {cityName} - {cities[cityName]}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvItem;
