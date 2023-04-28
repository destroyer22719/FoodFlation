"use client";

import CountryItem from "./CountryItem";

type Props = {
  locations: LocationObj;
};

const LocationTable: React.FC<Props> = ({ locations }) => {
  const countries = Object.keys(locations);

  return (
    <div>
      {countries.map((country) => (
        <CountryItem
          provs={locations[country]}
          country={country}
          key={country}
        />
      ))}
    </div>
  );
};

export default LocationTable;
