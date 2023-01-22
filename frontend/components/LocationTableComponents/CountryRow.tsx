import React from "react";
import ProvinceColumn from "./ProvinceColumn";
import { Collapse, ListItemButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "../../styles/StoreList.module.scss";
import { Location } from "../../pagesOld/store";

type Props = {
  location: Location;
};

const CountryRow: React.FC<Props> = ({ location }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={styles["store-list__location-country"]}>
      <ListItemButton
        onClick={handleClick}
        className={styles["store-list__location-country-item"]}
      >
        <div>
          <h2 key={location.country}>{location.country}</h2>
          {open ? <ExpandLess /> : <ExpandMore />}
        </div>
      </ListItemButton>
      <Collapse in={open} timeout={500} unmountOnExit>
        <ProvinceColumn
          provData={location.storeData}
          country={location.country}
        />
      </Collapse>
    </div>
  );
};

export default CountryRow;
