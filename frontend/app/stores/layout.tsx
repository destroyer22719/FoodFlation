import styles from "@/styles/StoreList.module.scss";
import SearchTable from "./Components/SearchTable/SearchTable";
import { getLocationsAndCompanies } from "@/queries/index";

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
  
  // const locations = {
  //   Canada: {
  //     Ontario: {
  //       Toronto: 14,
  //       Kingston: 3,
  //       Mississauga: 3,
  //       "East York": 1,
  //       Sudbury: 1,
  //       London: 2,
  //       Timmins: 1,
  //       Hamilton: 2,
  //       Ottawa: 3,
  //       Scarborough: 1,
  //     },
  //     Quebec: { Montreal: 3, Quebec: 3, Drummondville: 2 },
  //     "British Columbia": { Vancouver: 3 },
  //     Alberta: { Edmonton: 1 },
  //   },
  //   "United States": {
  //     Texas: { Houston: 8, Dallas: 3, Austin: 3 },
  //     "New York": { Brooklyn: 1, "New York": 7 },
  //     California: { "Los Angeles": 2, "San Diego": 3, "San Francisco": 3 },
  //     Michigan: { Detroit: 3 },
  //   },
  // };

  return (
    <div className={styles["store-list"]}>
      <SearchTable locations={locations} companies={companies} />
      <div>{children}</div>
    </div>
  );
};

export default layout;
