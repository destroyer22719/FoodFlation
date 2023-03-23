"use client";

import {
  notFound,
  redirect,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import CategoryButton from "@/components/CustomButtonComponents/CategoryButton";
import InputOutlined from "@/components/InputOutlined";
import { API_URL } from "@/config/index";

import styles from "@/styles/Store.module.scss";
import ItemCard from "@/components/ItemCard";
import { CategoryData, Item } from "global";

const storeFetcher = (id: string) =>
  fetch(`${API_URL}/stores/${id}`).then((res) => res.json());

const itemFetcher = ({
  id = "",
  page = 0,
  search = "",
  category = "",
}: {
  id: string;
  page: number;
  search: string;
  category: string;
}) =>
  fetch(
    `${API_URL}/items/store/${id}?page=${page}&search=${search}&${
      category ? `category=${category}` : ""
    }`
  ).then((res) => res.json());

const newUrl = (path: string, key: string, value: string) => {
  const regex = new RegExp(`(?<=${key}=)[^&]+`);
  if (path.match(regex)) {
    return path.replace(regex, `${value}`);
  } else if (path.indexOf("&") !== -1) {
    return `${path}&${key}=${value}`;
  } else if (path[path.length - 1] === "?") {
    return `${path}${key}=${value}`;
  }
  return `${path}?${key}=${value}`;
};

const page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const pathName = usePathname();
  const fullPath = `${pathName}?${paramsString}`;

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const pageSize = 10;
  const page = searchParams.get("page")
    ? +(searchParams.get("page") as String)
    : 1;
  const category = searchParams.get("category") || "";

  const showClear = !!(search || category);

  const { data: store, isLoading: isStoreLoading } = useSWR(id, storeFetcher);
  const { data: itemsData, isLoading: isItemsLoading } = useSWR(
    { id, page, search, category },
    itemFetcher
  );

  if (isStoreLoading || isItemsLoading) return <div>Loading...</div>;

  console.log(
    `${API_URL}/items/store/${id}?page=${page}&search=${search}&category=${category}`
  );

  const { resultsFound, categoryData, items, total } = itemsData;
  const maxPages = Math.ceil(resultsFound / pageSize);

  if (!store || !items) {
    notFound();
  }

  console.log(newUrl(fullPath, "page", (page + 1).toString()));

  return (
    <div>
      <div className={styles["store-page"]}>
        <h1 id="header">{store.name}</h1>
        <p>
          {store.street}, {store.city}, {store.country} |{" "}
          {store.postalCode ? store.postalCode : store.zipCode}
        </p>
        <div>{total} Items Tracked</div>
        <div className={styles["store-page__search"]}>
          <InputOutlined
            className={styles["store-page__search-bar"]}
            value={search || ""}
            placeholder="Enter Item Name"
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                redirect(`${currentPath}?search=${search}`);
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
          <Link href={showClear ? `${currentPath}?page=${page}` : "#"}>
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
          {(categoryData as CategoryData[]).map(
            ({ category, categoryCount }) => (
              <CategoryButton
                key={category}
                category={category}
                count={categoryCount}
                linkTo={`${currentPath}?category=${category
                  .replaceAll(" ", "%20")
                  .replaceAll("&", "%26")}`}
              />
            )
          )}
        </div>
        <div className={styles["store-page__pagination-buttons"]}>
          <Link
            href={
              page <= 1 ? "#" : newUrl(fullPath, "page", (page - 1).toString())
            }
            className={styles["store-page__pagination-button-link"]}
          >
            <ButtonContained
              disabled={page <= 1}
              className={styles["store-page__pagination-button"]}
            >
              {"<"}
            </ButtonContained>
          </Link>
          <ButtonContained className={styles["store-page__pagination-button"]}>
            <a
              href="#"
              className={styles["store-page__pagination-button-link"]}
            >
              {" "}
              Page {page}/{maxPages}
            </a>
          </ButtonContained>
          <Link
            href={
              page >= maxPages
                ? "#"
                : newUrl(fullPath, "page", (page + 1).toString())
            }
            className={styles["store-page__pagination-button-link"]}
          >
            <ButtonContained
              disabled={page >= maxPages}
              className={styles["store-page__pagination-button"]}
            >
              {">"}
            </ButtonContained>
          </Link>
        </div>
        <div className={styles["store-page__item-list"]}>
          {items.length > 0 ? (
            (items as Item[]).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <div>No stores found </div>
          )}
        </div>
        {items.length >= 8 && (
          <ButtonContained className={styles["store-page__back-to-top-button"]}>
            <Link
              href={`${currentPath}#header`}
              className={styles["store-page__back-to-top-button-link"]}
            >
              Back to top
            </Link>
          </ButtonContained>
        )}
      </div>
    </div>
  );
};

export default page;
