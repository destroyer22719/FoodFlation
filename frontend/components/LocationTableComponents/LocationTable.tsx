"use client";

import { Location } from "../../pagesOld/store";
import styles from "../../styles/StoreList.module.scss";
import CountryRow from "./CountryRow";

type Props = {
  locations: Location[];
};

const LocationTable: React.FC<Props> = ({ locations }) => {
  return (
    <div className={styles["store-list__location"]}>
      {locations.map((location) => (
        <CountryRow key={location.country} location={location} />
      ))}
    </div>
  );
};

export default LocationTable;

{
  /* 
<div
    key={i}
    className={styles["store-list__location-prov-item"]}
>
    <div
        className={
            styles["store-list__location-prov--gap"]
        }
    >
        <ListItemButton
            onClick={() => {
                openHandler(i);
            }}
        >
            <div
                className={
                    styles[
                        "store-list__location-prov-col"
                    ]
                }
            >
                <h3
                    className={
                        styles[
                            "store-list__location-prov--format"
                        ]
                    }
                >
                    <div>
                        {location.province}{" "}
                        {`(${location.cities.length})`}
                    </div>
                    <div>
                        {open[i] ? (
                            <div>{"▼"}</div>
                        ) : (
                            <div>{"▲"}</div>
                        )}
                    </div>
                </h3>
            </div>
        </ListItemButton>
    </div>
    <Collapse in={open[i]} timeout="auto" unmountOnExit>
        {location.cities.map((data, i) => (
            <div
                key={i}
                className={
                    styles[
                        "store-list__location-city-col"
                    ]
                }
            >
                <ButtonOutlined
                    onClick={() =>
                        setLocation(data.city)
                    }
                >
                    <span>
                        {data.city.split(", ")[0]} -{" "}
                        {data.cityCount}
                    </span>
                </ButtonOutlined>
            </div>
        ))}
    </Collapse>
</div>
))} */
}
