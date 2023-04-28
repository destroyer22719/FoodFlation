import styles from "@/styles/StoreList.module.scss";
import { getLocations } from "@/queries/index";
import LocationTable from "./Components/LocationTable/LocationTable";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const locationData = await getLocations();

  const locations: LocationObj = {};
  locationData.forEach(({ _count, city, country, province, state }) => {
    if (!locations[country]) {
      locations[country] = {};
    } else if (state && !locations[country][state]) {
      locations[country][state] = {};
    } else if (province && !locations[country][province]) {
      locations[country][province] = {};
    } else if (city && !locations[country][state || province!][city]) {
      locations[country][state || province!][city] = _count;
    }
  });

  return (
    <div className={styles["store-list"]}>
      <LocationTable locations={locations} />
      <div>{children}</div>
    </div>
  );
};

export default layout;
