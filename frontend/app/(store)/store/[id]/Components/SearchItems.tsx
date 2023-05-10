"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

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
    <div>
      <div onClick={searchItem}>
        <AiOutlineSearch />
      </div>
      <input
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
