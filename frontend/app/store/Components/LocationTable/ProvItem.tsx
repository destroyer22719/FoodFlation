import Link from "next/link";
import { useState } from "react";

type Props = {
  province: string;
  cities: {
    [key: string]: number;
  };
};

const ProvItem: React.FC<Props> = ({ cities, province }) => {
  const [open, setOpen] = useState(false);
  const cityNames = Object.keys(cities);

  return (
    <div>
      <div onClick={() => setOpen(!open)}>{province}</div>
      <div>
        {open &&
          cityNames.map((cityName) => (
            <Link href={`./?city=${cityName}`} key={cityName}>
              <div>
                {cityName} - {cities[cityName]}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProvItem;
