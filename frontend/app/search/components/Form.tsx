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
  locations,
}) => {
  const [country, setCountry] = useState<"" | "Canada" | "United States">(
    countryProp === "Canada" || countryProp === "United States"
      ? countryProp
      : ""
  );

  const provinceList = locations["Canada"].provinces;
  const stateList = locations["United States"].states;

  const containsProv =
    provinceProp && country === "Canada" && provinceList.includes(provinceProp);

  const containsState =
    stateProp && country === "United States" && stateList.includes(stateProp);

  const [province, setProvince] = useState(containsProv ? provinceProp : "");
  const [state, setState] = useState(containsState ? stateProp : "");

  const containsCity = () => {
    if (!cityProp) return false;
    if (country === "Canada" && province) {
      return locations["Canada"][province].includes(cityProp);
    } else if (country === "United States" && state) {
      return locations["United States"][state].includes(cityProp);
    }
    return false;
  };

  const [cities, setCities] = useState([] as string[]);
  const [city, setCity] = useState(containsCity() ? cityProp : "");
  const [search, setSearch] = useState(searchProp || "");

  return (
    <div>
      <div>
        <h3>Country</h3>
        <div>
          <div onClick={() => setCountry("Canada")}>Canada</div>
          <div onClick={() => setCountry("United States")}>United States</div>
        </div>
      </div>
      <div>
        {country && (
          <div>
            {country === "Canada" ? (
              <div>
                <h3>Provinces</h3>
                <div>
                  {provinceList.map((prov) => (
                    <div
                      onClick={() => {
                        setProvince(prov);
                        setCities(locations[country][prov]);
                      }}
                    >
                      {prov}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3>States</h3>
                <div>
                  {stateList.map((st) => (
                    <div
                      onClick={() => {
                        setState(st);
                        setCities(locations[country][st]);
                      }}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {(province || state) && (
          <div>
            <h3>Cities</h3>
            <div>
              {cities.map((cty) => (
                <div onClick={() => setCity(cty)}>{cty}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
