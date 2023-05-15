"use client";

import Locations from "./Locations";
import ItemSearch from "./ItemSearch";

import styles from "@/styles/components/ItemSearchForm.module.scss";

const Form = () => {


  return (
    <div className={styles["search-form"]} >
      <Locations />
      <ItemSearch />
    </div>
  );
};

export default Form;
