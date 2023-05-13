import { useContext } from "react";
import { useSearchParams } from "next/navigation.js";

import { FormContext } from "./FormRoot.tsx";

const Locations = () => {
  const {
    locations,
    cities,
    setCities,
    country,
    setCountry,
    province,
    setProvince,
    state,
    setState,
    setCity,
  } = useContext(FormContext);

  const provinceList = locations["Canada"].provinces;
  const stateList = locations["United States"].states;

  const searchParams = useSearchParams();

  const countryParam = searchParams.get("country");
  const provinceParam = searchParams.get("province");
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");

  if (countryParam === "Canada" || countryParam === "United States") {
    setCountry(countryParam);
  }

  if (
    provinceParam &&
    country === "Canada" &&
    provinceList.includes(provinceParam)
  ) {
    setProvince(provinceParam);
  }

  if (
    stateParam &&
    country === "United States" &&
    stateList.includes(stateParam)
  ) {
    setState(stateParam);
  }

  const containsCity = () => {
    if (!cityParam) return false;
    if (country === "Canada" && province) {
      return locations["Canada"][province].includes(cityParam);
    } else if (country === "United States" && state) {
      return locations["United States"][state].includes(cityParam);
    }
    return false;
  };

  if (containsCity()) {
    setCity(cityParam!);
  }

  return (
    <div>
      {" "}
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
    </div>
  );
};

export default Locations;
