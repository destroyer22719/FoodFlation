"use client";

import Locations from "./Locations";
import ItemSearch from "./ItemSearch";

import styles from "@/styles/components/ItemSearchForm.module.scss";
import { Suspense } from "react";

const Form = () => {
  return (
    <div className={styles["search-form"]}>
      <Suspense fallback={<></>}>
        <Locations />
      </Suspense>
      <Suspense fallback={<></>}>
        <ItemSearch />
      </Suspense>
    </div>
  );
};

export default Form;
