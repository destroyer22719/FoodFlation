import { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation.js";

import { FormContext } from "./FormRoot.tsx";

import styles from "@/styles/components/ItemSearchForm.module.scss";

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
    city,
  } = useContext(FormContext);

  const provinceList = locations["Canada"].provinces;
  const stateList = locations["United States"].states;

  const searchParams = useSearchParams()!;

  const countryParam = searchParams.get("country");
  const provinceParam = searchParams.get("province");
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");

  const containsCity = (country: string, stOrProv: string, city: string) => {
    return locations[country][stOrProv].includes(city);
  };

  useEffect(() => {
    if (countryParam === "Canada" || countryParam === "United States") {
      setCountry(countryParam);

      if (
        provinceParam &&
        countryParam === "Canada" &&
        provinceList.includes(provinceParam)
      ) {
        setProvince(provinceParam);

        if (cityParam && containsCity("Canada", provinceParam, cityParam)) {
          setCities(locations[countryParam][provinceParam]);
          setCity(cityParam);
        }
      } else if (
        stateParam &&
        countryParam === "United States" &&
        stateList.includes(stateParam)
      ) {
        setState(stateParam);

        if (cityParam && containsCity("United States", stateParam, cityParam)) {
          setCities(locations[countryParam][stateParam]);
          setCity(cityParam);
        }
      }
    }
  });

  return (
    <div>
      <div>
        <h3>Country</h3>
        <div className={styles["search-form__countries-list"]}>
          <div
            className={`${styles["search-form__country"]} ${
              country === "Canada" && styles["search-form__selected"]
            }`}
            onClick={() => {
              setCountry("Canada");
              setCities([]);
            }}
          >
            Canada
          </div>
          <div
            className={`
              ${styles["search-form__country"]} 
              ${
                country === "United States" && styles["search-form__selected"]
              }`}
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
                <div className={styles["search-form__province-list"]}>
                  {provinceList.map(
                    (prov) =>
                      prov !== "provinces" && (
                        <div
                          className={`
                            ${styles["search-form__province"]} ${
                            province === prov && styles["search-form__selected"]
                          }`}
                          key={prov}
                          onClick={() => {
                            setProvince(prov);
                            setCities(locations[country][prov]);
                            if (prov !== province) setCity("");
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
                <div className={styles["search-form__state-list"]}>
                  {stateList.map(
                    (st) =>
                      st !== "states" && (
                        <div
                          className={`
                            ${styles["search-form__state"]} 
                            ${state === st && styles["search-form__selected"]}
                          `}
                          key={st}
                          onClick={() => {
                            setState(st);
                            setCities(locations[country][st]);
                            if (st !== state) setCity("");
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
            <div className={styles["search-form__city-list"]}>
              {cities.map((cty) => (
                <div
                  className={`${styles["search-form__city"]} ${
                    city === cty && styles["search-form__selected"]
                  }`}
                  key={cty}
                  onClick={() => setCity(cty)}
                >
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
