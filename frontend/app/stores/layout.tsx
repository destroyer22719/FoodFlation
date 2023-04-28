import styles from "@/styles/StoreList.module.scss";
import SearchTable from "./Components/SearchTable";
import { getLocations } from "@/queries/index";

const layout = async ({ children }: { children: React.ReactNode }) => {
  //we're getting locations here instead of the locations table so that it doesn't fetch every render
  const locationData = await getLocations();

  const locations: LocationObj = {};
  locationData.forEach(({ _count, city, country, province, state }) => {
    if (!locations[country]) {
      locations[country] = {};
    }
    if (state && !locations[country][state]) {
      locations[country][state] = {};
    }
    if (province && !locations[country][province]) {
      locations[country][province] = {};
    }
    if (city && !locations[country][state || province!][city]) {
      locations[country][state || province!][city] = _count;
    }
  });

  return (
    <div className={styles["store-list"]}>
      <SearchTable locations={locations} />
      <div>{children}</div>
    </div>
  );
};

export default layout;
