"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  locations: LocationMap;
};

const Form: React.FC<Props> = ({ locations }) => {
  const searchParams = useSearchParams();

  const countryParam = searchParams.get("country");
  const provinceParam = searchParams.get("province");
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");
  const searchQueryParam = searchParams.get("search");
  
  const [country, setCountry] = useState<"" | "Canada" | "United States">(
    countryParam === "Canada" || countryParam === "United States"
      ? countryParam
      : ""
  );

  const provinceList = locations["Canada"].provinces;
  const stateList = locations["United States"].states;

  const containsProv =
    provinceParam && country === "Canada" && provinceList.includes(provinceParam);

  const containsState =
    stateParam && country === "United States" && stateList.includes(stateParam);

  const [province, setProvince] = useState(containsProv ? provinceParam : "");
  const [state, setState] = useState(containsState ? stateParam : "");

  const containsCity = () => {
    if (!cityParam) return false;
    if (country === "Canada" && province) {
      return locations["Canada"][province].includes(cityParam);
    } else if (country === "United States" && state) {
      return locations["United States"][state].includes(cityParam);
    }
    return false;
  };

  const [cities, setCities] = useState([] as string[]);
  const [city, setCity] = useState(containsCity() ? cityParam : "");
  const [search, setSearch] = useState("");
  const [notSearch, setNotSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState(
    searchQueryParam?.split(",") || []
  );

  const addSearch = (search: string, type: "search" | "notSearch") => {
    console.log(search, notSearch);
    if (search === "") return;
    if (type === "search") {
      setSearchQuery([...searchQuery, `+"${search}"`]);
      setSearch("");
    } else if (type === "notSearch") {
      setSearchQuery([...searchQuery, `-"${search}"`]);
      setNotSearch("");
    }
  };

  return (
    <div>
      <div>
        <h3>Country</h3>
        <div>
          <div
            onClick={() => {
              setCountry("Canada");
              setCities([]);
            }}
          >
            Canada
          </div>
          <div
            onClick={() => {
              setCountry("United States");
              setCities([]);
            }}
          >
            United States
          </div>
        </div>
      </div>
      <div>
        {country && (
          <div>
            {country === "Canada" ? (
              <div>
                <h3>Provinces</h3>
                <div>
                  {provinceList.map(
                    (prov) =>
                      prov !== "provinces" && (
                        <div
                          key={prov}
                          onClick={() => {
                            setProvince(prov);
                            setCities(locations[country][prov]);
                          }}
                        >
                          {prov}
                        </div>
                      )
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3>States</h3>
                <div>
                  {stateList.map(
                    (st) =>
                      st !== "states" && (
                        <div
                          key={st}
                          onClick={() => {
                            setState(st);
                            setCities(locations[country][st]);
                          }}
                        >
                          {st}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {!!cities.length && (
          <div>
            <h3>Cities</h3>
            <div>
              {cities.map((cty) => (
                <div key={cty} onClick={() => setCity(cty)}>
                  {cty}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {city && (
          <div>
            <h3>Search Item</h3>
            <div>
              <label htmlFor="search">Words To Search For</label>
              <div onClick={() => addSearch(search, "search")}>+</div>
              <input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g Milk"
              />
              <div>
                {searchQuery.map(
                  (query) =>
                    query.startsWith("+") && (
                      <div key={query}>{query.slice(2, query.length - 1)}</div>
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
                  (query) =>
                    query.startsWith("-") && (
                      <div key={query}>{query.slice(2, query.length - 1)}</div>
                    )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
