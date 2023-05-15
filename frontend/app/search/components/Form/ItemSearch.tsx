import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { MdAttachMoney } from "react-icons/md";
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineSearch } from "react-icons/ai";

import { FormContext } from "./FormRoot.tsx";

import styles from "@/styles/components/ItemSearchForm.module.scss";

const ItemSearch = () => {
  const {
    country,
    province,
    state,
    city,
    search,
    setSearch,
    notSearch,
    setNotSearch,
    asc,
    setAsc,
    searchQuery,
    setSearchQuery,
    searchByPrice,
    setSearchByPrice,
  } = useContext(FormContext);

  const searchParams = useSearchParams();

  const addSearch = (search: string, type: "search" | "notSearch") => {
    if (
      search === "" ||
      searchQuery.map((term) => term.slice(2, term.length - 1)).includes(search)
    )
      return;
    if (type === "search") {
      setSearchQuery([...searchQuery, ` "${search}"`]);
      setSearch("");
    } else if (type === "notSearch") {
      setSearchQuery([...searchQuery, `-"${search}"`]);
      setNotSearch("");
    }
  };

  const searchQueryParam = searchParams.get("search");
  const searchByPriceParam = searchParams.get("searchByPrice") === "true";
  const ascParam = searchParams.get("asc") === "true";

  useEffect(() => {
    if (searchQueryParam) {
      const newSearchQuery = searchQueryParam
        .split(" ")
        .filter((term) => term !== "")
        .map((term) => {
          if (!term.startsWith("-")) {
            return ` ${term}`;
          }
          return term;
        });
      setSearchQuery(newSearchQuery);
    }

    setAsc(ascParam);
    setSearchByPrice(searchByPriceParam);
  }, []);

  const router = useRouter();
  const searchAllowed = city && searchQuery.length > 0;

  const generateQueryToString = () => {
    let query = "";
    searchQuery.forEach((term) => {
      const newTerm = term.replaceAll("&", "%26");
      if (term.startsWith(" ")) {
        query += newTerm;
      } else {
        query += ` ${newTerm}`;
      }
    });

    return query;
  };

  const searchItems = () => {
    if (!searchAllowed) return;
    router.push(
      `/search?search=${generateQueryToString()}&city=${city}&asc=${asc}&searchByPrice=${searchByPrice}&country=${country}&${
        country === "Canada" ? `province=${province}` : `state=${state}`
      }`
    );
  };

  const deleteSearch = (index: number) => {
    setSearchQuery([
      ...searchQuery.slice(0, index),
      ...searchQuery.slice(index + 1),
    ]);
  };

  return (
    <>
      {city && (
        <>
          <div>
            <h3>Search Item</h3>
            <div>
              <label htmlFor="search">Words To Search For</label>
              <div className={styles["search-form__input-section"]}>
                <div
                  className={styles["search-form__input-add"]}
                  onClick={() => addSearch(search, "search")}
                >
                  <AiOutlinePlus />
                </div>
                <input
                  id="search"
                  value={search}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSearch(search, "search");
                    }
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g Milk"
                />
              </div>
              <div className={styles["search-form__search-terms"]}>
                {searchQuery.map(
                  (searchTerm, i) =>
                    searchTerm.startsWith(" ") && (
                      <div
                        key={searchTerm}
                        className={`
                          ${styles["search-form__search-term"]}
                          ${styles["search-form__search-add"]}
                        `}
                      >
                        <div
                          key={searchTerm}
                          onClick={() => deleteSearch(i)}
                          className={styles["search-form__search-term-delete"]}
                        >
                          <RxCross1 />
                        </div>
                        <div
                          className={styles["search-form__search-term-text"]}
                        >
                          {searchTerm.slice(2, searchTerm.length - 1)}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
            <div>
              <label htmlFor="notSearch">Words To Exclude</label>
              <div className={styles["search-form__input-section"]}>
                <div
                  className={styles["search-form__input-add"]}
                  onClick={() => addSearch(notSearch, "notSearch")}
                >
                  <AiOutlinePlus />
                </div>
                <input
                  id="notSearch"
                  value={notSearch}
                  onChange={(e) => setNotSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSearch(notSearch, "notSearch");
                    }
                  }}
                  placeholder="e.g Chocolate, to NOT look for chocolate milk"
                />
              </div>
              <div className={styles["search-form__search-terms"]}>
                {searchQuery.map(
                  (searchTerm, i) =>
                    searchTerm.startsWith("-") && (
                      <div
                        key={searchTerm}
                        className={`
                          ${styles["search-form__search-term"]}
                          ${styles["search-form__search-not"]}
                        `}
                      >
                        <div
                          onClick={() => deleteSearch(i)}
                          className={styles["search-form__search-term-delete"]}
                        >
                          <RxCross1 />
                        </div>
                        <div
                          className={styles["search-form__search-term-text"]}
                        >
                          {searchTerm.slice(2, searchTerm.length - 1)}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
          <div>
            <h3>Sort By</h3>
            <div className={styles["search-form__sort-by-section"]}>
              <div
                title="Sort by price"
                className={`
                  ${styles["search-form__sort-by-price"]} 
                  ${searchByPrice && styles["search-form__selected"]}
                `}
                onClick={() => {
                  setSearchByPrice(true);
                  setAsc(true);
                }}
              >
                <MdAttachMoney />
              </div>
              <div
                title="Sort by time updated"
                className={`
                  ${styles["search-form__sort-by-time"]} 
                  ${!searchByPrice && styles["search-form__selected"]}
                `}
                onClick={() => {
                  setSearchByPrice(false);
                  setAsc(false);
                }}
              >
                <BiTime />
              </div>
              <div
                className={styles["search-form__asc-desc"]}
                onClick={() => setAsc(!asc)}
              >
                {asc ? (
                  <div
                    title={
                      searchByPrice ? "Lowest to Highest" : "Oldest to Newest"
                    }
                  >
                    <BsArrowUpRight />
                  </div>
                ) : (
                  <div
                    title={
                      searchByPrice ? "Highest to Lowest" : "Newest to Oldest"
                    }
                  >
                    <BsArrowDownRight />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={() => searchItems()}
            className={
              styles[
                `search-form__search-button${searchAllowed ? "" : "--disabled"}`
              ]
            }
          >
            <AiOutlineSearch />
          </div>
        </>
      )}
    </>
  );
};

export default ItemSearch;
