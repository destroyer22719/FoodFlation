import styles from "@/styles/StoreList.module.scss";
import { API_URL } from "@/config/index";
import LocationTable from "@/components/LocationTableComponents/LocationTable";
import SearchStore from "./Components/SearchStore";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const locationReq = await fetch(`${API_URL}/stores/locations`);
  const locations = await locationReq.json();

  return (
    <div className={styles["store-list"]}>
      <div id="header"></div>
      <SearchStore />
      <LocationTable locations={locations} />
      <>{children}</>
    </div>
  );
};

export default layout;
