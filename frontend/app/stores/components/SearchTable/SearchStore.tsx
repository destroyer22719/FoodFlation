"use client";

import { useState } from "react";
import { MdOutlineLocationSearching } from "react-icons/md";

import styles from "@/styles/components/SearchStore.module.scss";
import { useRouter } from "next/navigation";

const SearchStore = () => {
  const router = useRouter();
  const [codeInput, setCodeInput] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const searchByCode = () => {
    const postalCodeRegex = /^[A-Z]\d[A-Z][ ]\d[A-Z]\d$/;
    const zipCodeRegex = /^\d{5}$/;
    if (postalCodeRegex.test(codeInput)) {
      router.push(`/stores?postalCode=${codeInput}`);
    } else if (zipCodeRegex.test(codeInput)) {
      router.push(`/stores?zipCode=${codeInput}`);
    } else {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }
  };

  return (
    <div className={styles["search-stores"]}>
      <div className={styles["search-stores__section"]}>
        <div
          className={styles["search-stores__icon"]}
          onClick={() => searchByCode()}
        >
          <MdOutlineLocationSearching />
        </div>
        <input
          className={styles["search-stores__input"]}
          value={codeInput}
          placeholder="A1A 1A1 or 12345"
          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchByCode();
            }
          }}
        />
      </div>
      <div>
        {showWarning && (
          <div className={styles["search-stores__warning"]}>
            Please enter a valid postal code or zip code
          </div>
        )}
        {codeInput && (
          <div className={styles["search-stores__warning"]}>
            This search functions only searches by exact postal codes or zip
            codes, not the nearest stores to it
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStore;
