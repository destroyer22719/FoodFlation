import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";

import ButtonOutlined from "@/components/CustomButtonComponents/ButtonOutlined";
import InputOutlined from "@/components/InputOutlined";

const SearchItems = () => {
  const [search, setSearch] = useState("");

  return (
    <div className={""}>
      <InputOutlined
        className={""}
        value={search}
        placeholder="Enter Item to Search"
        onChange={(e) => {
          setSearch((e.target as HTMLInputElement).value.toUpperCase());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
          }
        }}
      />
      <ButtonOutlined className={""}>
        <SearchIcon /> Search Prices
      </ButtonOutlined>
    </div>
  );
};

export default SearchItems;
