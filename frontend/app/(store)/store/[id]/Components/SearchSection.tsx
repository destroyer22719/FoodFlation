"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import styles from "@/styles/Store.module.scss";
import InputOutlined from "@/components/InputOutlined";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { CategoryData } from "global";
import CategoryButton from "@/components/CustomButtonComponents/CategoryButton";

type Props = {
  categoryData: CategoryData[];
  resultsFound: number;
};

const SearchSection: React.FC<Props> = ({ categoryData, resultsFound }) => {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const showClear = !!(search || category);

  return (
    <>
      <div className={styles["store-page__search"]}>
        <InputOutlined
          className={styles["store-page__search-bar"]}
          value={search || ""}
          placeholder="Enter Item Name"
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`${currentPath}?search=${search}`);
            }
          }}
        />
        <Link href={`${currentPath}?search=${search}`}>
          <ButtonContained className={styles["store-page__search-button"]}>
            <SearchIcon />
          </ButtonContained>
        </Link>
      </div>
      <div className={styles["store-page__category-list"]}>
        <Link href={showClear ? currentPath : "#"}>
          <IconButton
            disabled={!showClear}
            className={styles["store-page__category-clear"]}
          >
            <CloseIcon
              className={styles["store-page__category-clear-icon"]}
              sx={{
                fill: showClear ? "white" : "transparent",
              }}
            />
          </IconButton>
        </Link>
        <ButtonContained>{resultsFound} Items Found</ButtonContained>
        {categoryData.map(({ category, categoryCount }) => (
          <CategoryButton
            key={category}
            category={category}
            count={categoryCount}
            linkTo={`${currentPath}?category=${category
              .replaceAll(" ", "%20")
              .replaceAll("&", "%26")}`}
          />
        ))}
      </div>
    </>
  );
};

export default SearchSection;
