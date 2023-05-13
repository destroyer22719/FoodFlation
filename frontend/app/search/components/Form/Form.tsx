"use client";

import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import Locations from "./Locations";
import ItemSearch from "./ItemSearch";
import { FormContext } from "./FormRoot.tsx";

const Form = () => {
  const { locations, city } = useContext(FormContext);
  // const searchParams = useSearchParams();

  // const countryParam = searchParams.get("country");
  // const provinceParam = searchParams.get("province");
  // const stateParam = searchParams.get("state");
  // const cityParam = searchParams.get("city");
  // const searchQueryParam = searchParams.get("search");

  // const [country, setCountry] = useState<"" | "Canada" | "United States">(
  //   countryParam === "Canada" || countryParam === "United States"
  //     ? countryParam
  //     : ""
  // );

  // const provinceList = locations["Canada"].provinces;
  // const stateList = locations["United States"].states;

  // const containsProv =
  //   provinceParam &&
  //   country === "Canada" &&
  //   provinceList.includes(provinceParam);

  // const containsState =
  //   stateParam && country === "United States" && stateList.includes(stateParam);

  // const [province, setProvince] = useState(containsProv ? provinceParam : "");
  // const [state, setState] = useState(containsState ? stateParam : "");

  // const containsCity = () => {
  //   if (!cityParam) return false;
  //   if (country === "Canada" && province) {
  //     return locations["Canada"][province].includes(cityParam);
  //   } else if (country === "United States" && state) {
  //     return locations["United States"][state].includes(cityParam);
  //   }
  //   return false;
  // };

  // const [cities, setCities] = useState([] as string[]);
  // const [city, setCity] = useState(containsCity() ? cityParam : "");
  // const [search, setSearch] = useState("");
  // const [notSearch, setNotSearch] = useState("");
  // const [asc, setAsc] = useState(false);
  // const [searchByPrice, setSearchByPrice] = useState(true);

  // const [searchQuery, setSearchQuery] = useState(
  //   searchQueryParam?.split(",") || []
  // );


  return (
    <div>
      <Locations />
      <div>
        {city && (
          <ItemSearch
            // search={search}
            // setSearch={setSearch}
            // notSearch={notSearch}
            // setNotSearch={setNotSearch}
            // asc={asc}
            // setAsc={setAsc}
            // searchQuery={searchQuery}
            // setSearchQuery={setSearchQuery}
            // setSearchByPrice={setSearchByPrice}
          />
        )}
      </div>
    </div>
  );
};

export default Form;
