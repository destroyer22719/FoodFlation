import styles from "@/styles/StoreList.module.scss";
// import StoreItem from "@/components/StoreItem/StoreItem";
// import PaginationComponent from "./Components/PaginationComponent";
// import { searchStores } from "queries";

type Props = {
  searchParams: {
    city?: string;
    companyId?: string;
    postalCode?: string;
    zipCode?: string;
  };
};

const StorePages = async ({ searchParams }: Props) => {
  

  return (
    <div className={styles["store-list"]}>

    </div>
  );
};

export default StorePages;
