import style from "@/styles/pages/Index.module.scss";
import { getCounts } from "../graphql/queries";

import styles from "@/styles/pages/Index.module.scss";

const HomePage = async () => {
  const { itemCount, storeCount } = await getCounts();

  return (
    <div className={style["home"]}>
      <div>
        <h1>FoodFlation</h1>
        <div>Helping consumers undersand and navigate food inflation</div>
        <div className={styles["home__stats"]}>
          <div className={styles["home__stat"]}>{itemCount} items</div>
          <div className={styles["home__stat"]}>{storeCount} stores</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
