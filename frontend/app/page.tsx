import { Metadata } from "next";

import { getCounts } from "@/graphql/queries";
import styles from "@/styles/pages/Index.module.scss";
import Stats from "./components/stats";

export const metadata: Metadata = {
  title: "FoodFlation | Home",
};

const HomePage = async () => {
  const { itemCount, storeCount } = await getCounts();

  return (
    <div className={styles["home"]}>
      <div>
        <h1>FoodFlation</h1>
        <div>Helping consumers undersand and navigate food inflation</div>
        <Stats itemTotal={itemCount} storeTotal={storeCount} />
        {/* <div className={styles["home__stats"]}>
          <div className={styles["home__stat"]}>{itemCount} items</div>
          <div className={styles["home__stat"]}>{storeCount} stores</div>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
