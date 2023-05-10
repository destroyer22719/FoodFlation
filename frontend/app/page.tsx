import style from "@/styles/Index.module.scss";
import { getCounts } from "../graphql/queries";

const HomePage = async () => {
  const { itemCount, storeCount } = await getCounts();

  return (
    <>
      <div className={style["home"]}>
        <h1>FoodFlation</h1>
        <p>
          Tracking the prices of {itemCount} items from {storeCount} different stores
          across Canada and the US!
        </p>
      </div>
    </>
  );
};

export default HomePage;
