import style from "@/styles/Index.module.scss";
import { API_URL } from "@/config/index";

const HomePage = async () => {
  const itemCountReq = await fetch(`${API_URL}/items/count`);
  const storeCountReq = await fetch(`${API_URL}/stores/count`);

  const itemCount = (await itemCountReq.json()).count;
  const storeCount = (await storeCountReq.json()).count;

  return (
    <>
      <div className={style["home"]}>
        <h1>FoodFlation</h1>
        <p>Tracking the prices of {itemCount} from {storeCount} different stores across Canada and the US!</p>
      </div>
    </>
  );
};

export default HomePage;
