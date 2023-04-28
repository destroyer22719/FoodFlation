import { useState } from "react";
import ProvItem from "./ProvItem";

type Props = {
  country: string;
  provs: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

const CountryItem: React.FC<Props> = ({ provs, country }) => {
  const [open, setOpen] = useState(false);

  const provinces = Object.keys(provs);
  
  return (
    <div>
      <div onClick={() => setOpen(!open)}>{country}</div>
      <div>
        {open &&
          provinces.map((province) => (
            <ProvItem
              cities={provs[province]}
              province={province}
              key={province}
            />
          ))}
      </div>
    </div>
  );
};

export default CountryItem;
