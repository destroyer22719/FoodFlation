import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, ListItemButton } from "@mui/material";
import styles from "@/styles/StoreList.module.scss";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import Link from "next/link";

type CityData = {
  city: string;
  cityCount: number;
};

type StoreData = {
  state?: string;
  province?: string;
  stores: CityData[];
};

type Prop = {
  prov: StoreData;
  isCanada: boolean;
};

const ProvinceColumnItem: React.FC<Prop> = ({ prov, isCanada }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={styles["store-list__location-prov-item"]}>
      <ListItemButton onClick={handleClick}>
        <h3 key={isCanada ? prov.province : prov.state}>
          {isCanada ? prov.province : prov.state}{" "}
          {open ? <ExpandLess /> : <ExpandMore />}
        </h3>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={styles["store-list__location-city"]}>
          {prov.stores.map((store) => (
            <Link
              key={store.city}
              href={`/store?city=${store.city}&${
                isCanada ? `province=${prov.province}` : `state=${prov.state}`
              }#storeList`}
            >
              <ButtonContained
                className={styles["store-list__location-city-item"]}
              >
                {store.city} - {store.cityCount}
              </ButtonContained>
            </Link>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ProvinceColumnItem;
