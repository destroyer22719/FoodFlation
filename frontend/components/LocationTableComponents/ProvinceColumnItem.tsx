import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, ListItemButton } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/StoreList.module.scss";
import { StoreData } from "../../pages/store";
import ButtonContained from "../CustomButtonComponents/ButtonContained";
import { useStoreContext } from "../../providers/storeContext";

type Prop = {
    prov: StoreData;
    isCanada: boolean;
};

const ProvinceColumnItem: React.FC<Prop> = ({ prov, isCanada }) => {
    const [open, setOpen] = useState(false);
    const { updateStoreList } = useStoreContext();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className={styles["store-list__location-prov-item"]}>
            <ListItemButton onClick={handleClick}>
                <h3 key={isCanada ? prov.province : prov.state}>
                {isCanada ? prov.province : prov.state} {open ? <ExpandLess /> : <ExpandMore />}
                </h3>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className={styles["store-list__location-city"]}>
                    {prov.stores.map((store) => (
                        <ButtonContained
                            key={store.city}
                            className={styles["store-list__location-city-item"]}
                            onClick={() =>
                                updateStoreList({
                                    citySearch: store.city,
                                    stateSearch: isCanada
                                        ? undefined
                                        : prov.state!,
                                    provinceSearch: isCanada
                                        ? prov.province!
                                        : undefined,
                                })
                            }
                        >
                            {store.city} - {store.cityCount}
                        </ButtonContained>
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

export default ProvinceColumnItem;
