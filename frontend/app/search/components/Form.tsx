"use client";

import { useState } from "react";

type Props = {
  country?: string;
  province?: string;
  state?: string;
  city?: string;
  search?: string;
  locations: LocationMap;
};

const Form: React.FC<Props> = ({
  country: countryProp,
  province: provinceProp,
  state: stateProp,
  city: cityProp,
  search: searchProp,
}) => {
  const [country, setCountry] = useState<"" | "Canada" | "United States">(
    countryProp === "Canada" || countryProp === "United States"
      ? countryProp
      : ""
  );

  const province = useState(provinceProp);
  const state = useState(stateProp);
  const city = useState(cityProp);
  const search = useState(searchProp);

  return (
    <div>
      <div>
        <label htmlFor="country">Country</label>
        <div>
          <div onClick={() => setCountry("Canada")}>Canada</div>
          <div onClick={() => setCountry("United States")}>United States</div>
        </div>
      </div>
    </div>
  );
};

export default Form;
