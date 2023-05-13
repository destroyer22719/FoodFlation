type Props = {
  locations: LocationMap;
  country: string;
  cities: string[];
  setCountry: (country: "Canada" | "United States") => void;
  setProvince: (province: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setCities: (cities: string[]) => void;
};

const Locations = ({
  locations,
  country,
  cities,
  setCountry,
  setCities,
  setCity,
  setProvince,
  setState,
}: Props) => {
  const provinceList = locations["Canada"].provinces;
  const stateList = locations["United States"].states;

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
