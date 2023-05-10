"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import styles from "@/styles/components/SearchItems.module.scss";

const SearchItems = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const currentPath = usePathname();
  const searchItem = () => {
    if (search) {
      router.push(`${currentPath}?search=${search}`);
    }
  };

  return (
    <div className={styles["search-items"]}>
      <div onClick={searchItem} className={styles["search-items__button"]}>
        <AiOutlineSearch className={styles["search-items__icon"]} />
      </div>
      <input
        className={styles["search-items__input"]}
        placeholder="Search For Items"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchItem();
          }
        }}
      />
    </div>
  );
};

export default SearchItems;
