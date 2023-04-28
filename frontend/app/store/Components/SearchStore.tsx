"use client";

import { useState } from "react";
import { MdOutlineLocationSearching } from "react-icons/md";

import styles from "@/styles/Components/SearchStore.module.scss";

const SearchStore = () => {
  const [codeInput, setCodeInput] = useState("");

  const postalCodeRegex = /^[A-Z]\d[A-Z][ ]\d[A-Z]\d$/;
  const zipCodeRegex = /^\d{5}$/;

  const inputHandler = (codeInput: string) => {
    codeInput = codeInput.toUpperCase();
    if (postalCodeRegex.test(codeInput) || zipCodeRegex.test(codeInput)) {
      setCodeInput(codeInput);
    }
  };

  return (
    <div className={styles["search-stores"]}>
      <div className={styles["search-stores__section"]}>
        <div className={styles["search-stores__icon"]}>
          <MdOutlineLocationSearching />
        </div>
        <input
          className={styles["search-stores__input"]}
          value={codeInput}
          placeholder="A1A 1A1 or 12345"
          onChange={(e) => inputHandler(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            }
          }}
        />
      </div>
      <div className={styles["search-stores__disclaimer"]}>
        {codeInput &&
          "This search functions only searches by exact postal codes or zip codes, not the nearest stores to it"}
      </div>
    </div>
  );
};

export default SearchStore;
