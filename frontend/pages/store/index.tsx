import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreItem";
import { API_URL } from "../../config";
import { Store } from "../../global";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import styles from "../../styles/StoreList.module.scss";
import ButtonContained from "../../components/CustomButtonComponents/ButtonContained";
import ButtonOutlined from "../../components/CustomButtonComponents/ButtonOutlined";
import { CircularProgress, Collapse, ListItemButton } from "@mui/material";
import InputOutlined from "../../components/InputOutlined";
import LocationTable from "../../components/LocationTableComponents/LocationTable";

type Props = {
    locations: Location[];
};

export type Country = "Canada" | "United States";

export type CityData = {
    city: string;
    cityCount: number;
};

export type StoreData = {
    state?: string;
    province?: string;
    stores: CityData[];
};

export type Location = {
    country: Country;
    storeData: StoreData[];
};
const postalCodeRegex: RegExp =
    /^[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])$/;

const StoresPage: React.FC<Props> = ({ locations }) => {
    const [postalCode, setPostalCode] = useState("");
    const initialArray: boolean[] = [];
    initialArray.length = locations.length;

    const router = useRouter();

    const [city, setCity] = useState(router.query.city || "");
    const [state, setState] = useState(router.query.state || "");
    const [province, setProvince] = useState(router.query.province || "");

    const [page, setPage] = useState(1);
    const [totalStores, setTotalStores] = useState(1);
    const pageSize = 10;
    const maxPages = Math.ceil(totalStores / pageSize);
    const [stores, setStores] = useState<Store[]>([]);
    const navigatePages = (pageChange: number) => {
        if (pageChange < 0 && page === 1) {
            return;
        } else if (pageChange > 0 && page === maxPages) {
            return;
        }
        setPage(page + pageChange);
    };

    const searchByPostalCode = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores?postalCode=${postalCode}`
        );
        const data = await res.json();
        setStores(data);
    };

    useEffect(() => {
        (async () => {
            if (page && city && (state || province)) {
                setStores([]);
                setTotalStores(1);
                const storeReq = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_API_URL
                    }/stores?page=${page}&city=${city}&state=${
                        state || ""
                    }&province=${province || ""}`
                );
                const storeRes = await storeReq.json();
                setStores(storeRes.stores);
                setTotalStores(storeRes.total);
            }
        })();
    }, [page, city, state, province]);

    return (
        <Layout title="Store List">
            <div className={styles["store-list"]}>
                <div className={styles["store-list__search"]}>
                    <InputOutlined
                        className={styles["store-list__search-bar"]}
                        value={postalCode}
                        placeholder="Enter Postal Code of Store"
                        onChange={(e) => {
                            const input = (
                                e.target as HTMLInputElement
                            ).value.toUpperCase();
                            if (input.match(postalCodeRegex))
                                setPostalCode(input);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                router.push(
                                    `/store?postalCode=${
                                        postalCode.slice(0, 3) +
                                        " " +
                                        postalCode.slice(3)
                                    }`
                                );
                            }
                        }}
                    />
                    <ButtonOutlined
                        className={styles["store-list__search-button"]}
                        onClick={() => searchByPostalCode()}
                    >
                        <SearchIcon /> Find a Store
                    </ButtonOutlined>
                </div>
                <LocationTable locations={locations} />
                {(city && (state || province)) && (
                    <div className={styles["store-list__pagination-buttons"]}>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                            disabled={page == 1}
                            onClick={() => navigatePages(-1)}
                        >
                            <div
                                className={
                                    styles["store-list__pagination-button-link"]
                                }
                            >
                                {"<"}
                            </div>
                        </ButtonContained>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                        >
                            <div
                                className={
                                    styles["store-list__pagination-button-link"]
                                }
                            >
                                Page {page}/{maxPages}
                            </div>
                        </ButtonContained>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                            disabled={page == maxPages}
                            onClick={() => navigatePages(1)}
                        >
                            <div
                                className={
                                    styles["store-list__pagination-button-link"]
                                }
                            >
                                {">"}
                            </div>
                        </ButtonContained>
                    </div>
                )}
                {postalCode || (city && (state || province)) ? (
                    stores.length ? (
                        <div
                            className={styles["store-list__list"]}
                            id="storeList"
                        >
                            {stores.map((store) => (
                                <StoreList key={store.id} store={store} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles["store-list__loader"]}>
                            <CircularProgress />
                        </div>
                    )
                ) : (
                    <div></div>
                )}
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const locationRes = await fetch(`${API_URL}/stores/locations`);
    const locations = await locationRes.json();

    return {
        props: {
            locations,
        },
    };
};

export default StoresPage;
