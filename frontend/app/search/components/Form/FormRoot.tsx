"use client";

import { createContext, useState } from "react";
import Form from "./Form";

type FormContextType = {
  country: "" | "United States" | "Canada";
  setCountry: (country: "Canada" | "United States") => void;
  province: string;
  setProvince: (province: string) => void;
  state: string;
  setState: (state: string) => void;
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  setCities: (cities: string[]) => void;
  search: string;
  setSearch: (search: string) => void;
  notSearch: string;
  setNotSearch: (notSearch: string) => void;
  asc: boolean;
  searchByPrice: boolean;
  setSearchByPrice: (searchByPrice: boolean) => void;
  setAsc: (asc: boolean) => void;
  searchQuery: string[];
  setSearchQuery: (searchQuery: string[]) => void;
  locations: LocationMap;
};

export const FormContext = createContext<FormContextType>({
  country: "",
  setCountry: () => {},
  province: "",
  setProvince: () => {},
  state: "",
  setState: () => {},
  city: "",
  setCity: () => {},
  cities: [],
  setCities: () => {},
  search: "",
  setSearch: () => {},
  notSearch: "",
  setNotSearch: () => {},
  searchByPrice: true,
  setSearchByPrice: () => {},
  asc: true,
  setAsc: () => {},
  searchQuery: [],
  setSearchQuery: () => {},
  locations: {},
});

type FormProviderProps = {
  locations: LocationMap;
};

const FormRoot: React.FC<FormProviderProps> = ({ locations }) => {
  const [country, setCountry] = useState<"Canada" | "United States" | "">("");
  const [province, setProvince] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([] as string[]);
  const [search, setSearch] = useState("");
  const [notSearch, setNotSearch] = useState("");
  const [searchByPrice, setSearchByPrice] = useState(true);
  const [asc, setAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState([] as string[]);
  
  return (
    <FormContext.Provider
      value={{
        country,
        setCountry,
        province,
        setProvince,
        state,
        setState,
        city,
        setCity,
        cities,
        setCities,
        search,
        setSearch,
        notSearch,
        setNotSearch,
        searchByPrice,
        setSearchByPrice,
        asc,
        setAsc,
        searchQuery,
        setSearchQuery,
        locations,
      }}
    >
      <Form />
    </FormContext.Provider>
  );
};

export default FormRoot;
