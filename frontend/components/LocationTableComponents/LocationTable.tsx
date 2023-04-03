"use client";

import { Location } from "../../pagesOld/store";
import styles from "../../styles/StoreList.module.scss";
import CountryRow from "./CountryRow";

type Props = {
  locations: Location[];
};

const LocationTable: React.FC<Props> = ({ locations }) => {
  return (
    <div className={styles["store-list__location"]}>
      {locations.map((location) => (
        <CountryRow key={location.country} location={location} />
      ))}
    </div>
  );
};

export default LocationTable;
