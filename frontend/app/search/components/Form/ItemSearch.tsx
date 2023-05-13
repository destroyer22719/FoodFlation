import React, { useContext } from "react";
import { MdAttachMoney } from "react-icons/md";
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { FormContext } from "./FormRoot.tsx";
import { useSearchParams } from "next/navigation";

const ItemSearch = () => {
  const {
    city,
    search,
    setSearch,
    notSearch,
    setNotSearch,
    asc,
    setAsc,
    searchQuery,
    setSearchQuery,
    setSearchByPrice,
  } = useContext(FormContext);

  const searchParams = useSearchParams();

  const addSearch = (search: string, type: "search" | "notSearch") => {
    if (search === "") return;
    if (type === "search") {
      setSearchQuery([...searchQuery, `+"${search}"`]);
      setSearch("");
    } else if (type === "notSearch") {
      setSearchQuery([...searchQuery, `-"${search}"`]);
      setNotSearch("");
    }
  };

  const searchQueryParam = searchParams.get("search");

  if (searchQueryParam) {
    setSearchQuery(searchQueryParam.split(","));
  }

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
              <div onClick={() => addSearch(search, "search")}>+</div>
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
              <div>
                {searchQuery.map(
                  (searchTerm, i) =>
                    searchTerm.startsWith("+") && (
                      <div key={searchTerm}>
                        <div onClick={() => deleteSearch(i)}>X</div>
                        <div>{searchTerm.slice(2, searchTerm.length - 1)}</div>
                      </div>
                    )
                )}
              </div>
            </div>
            <div>
              <label htmlFor="notSearch">Words To Exclude</label>
              <div onClick={() => addSearch(notSearch, "notSearch")}>+</div>
              <input
                id="notSearch"
                value={notSearch}
                onChange={(e) => setNotSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSearch(notSearch, "notSearch");
                  }
                }}
                placeholder="e.g Chocolate, to look for milk, but not chocolate milk"
              />
              <div>
                {searchQuery.map(
                  (searchTerm, i) =>
                    searchTerm.startsWith("-") && (
                      <div key={searchTerm}>
                        <div onClick={() => deleteSearch(i)}>X</div>
                        <div>{searchTerm.slice(2, searchTerm.length - 1)}</div>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
          <div>
            <h3>Sort By</h3>
            <div>
              <div onClick={() => setSearchByPrice(true)}>
                <MdAttachMoney />
              </div>
              <div onClick={() => setSearchByPrice(false)}>
                <BiTime />
              </div>
            </div>
            <div>
              {asc ? (
                <div onClick={() => setAsc(false)}>
                  <BsArrowUpRight />
                </div>
              ) : (
                <div onClick={() => setAsc(true)}>
                  <BsArrowDownRight />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ItemSearch;
