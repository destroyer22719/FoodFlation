"use client";

import CarouselComponent from "@/components/CarouselComponent/CarouselComponent";
import style from "@/styles/Index.module.scss";
import { API_URL } from "@/config/index";
import { use } from "react";

const getCount = async (): Promise<{
  itemCount: number;
  storeCount: number;
}> => {
  try {
    const itemCountReq = await fetch(`${API_URL}/items/count`);
    const storeCountReq = await fetch(`${API_URL}/stores/count`);
  
    const itemCount = (await itemCountReq.json()).count;
    const storeCount = (await storeCountReq.json()).count;
  
    return { itemCount, storeCount };
  } catch (err) {
    throw new Error("Error fetching data")
  }
};

const HomePage = () => {
  const { itemCount, storeCount } = use(getCount());
  
  return (
    <>
      <div className={style["home"]}>
        <h1>FoodFlation</h1>
        <p>
          Tracking prices of {itemCount} different items in {storeCount}{" "}
          different stores across Canada and the US
        </p>
      </div>
      <CarouselComponent />
    </>
  );
};

export default HomePage;
