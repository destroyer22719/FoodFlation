import { Country, StoreData } from "../../pages/store";
import styles from "../../styles/StoreList.module.scss";
import ProvinceColumnItem from "./ProvinceColumnItem";

type Props = {
    provData: StoreData[];
    country: Country;
};

const ProvinceColumn: React.FC<Props> = ({ provData, country }) => {
    return (
        <div className={styles["store-list__location-prov"]}>
            {provData.map((prov, i) => (
                <ProvinceColumnItem
                    isCanada={country === "Canada"}
                    key={i}
                    prov={prov}
                />
            ))}
        </div>
    );
};

export default ProvinceColumn;
