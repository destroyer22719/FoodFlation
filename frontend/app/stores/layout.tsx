import styles from "@/styles/pages/StoreList.module.scss";
import SearchTable from "./components/SearchTable/SearchTable";
import { getLocationsAndCompanies } from "@/graphql/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodFlation | Search Stores",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  //we're getting locations here instead of the locations table so that it doesn't fetch every render
  const { locations: locationData, companies } =
    await getLocationsAndCompanies();

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
      <SearchTable locations={locations} companies={companies} />
      <div>{children}</div>
    </div>
  );
};

export default layout;
