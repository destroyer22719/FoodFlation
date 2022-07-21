import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreItem";
import { API_URL } from "../../config";
import { Store } from "../../global";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import styles from "../../styles/StoreList.module.scss";
import ButtonContained from "../../components/ButtonContained";
import ButtonOutlined from "../../components/ButtonOutlined";
import { CircularProgress, Collapse, ListItemButton } from "@mui/material";
import InputOutlined from "../../components/InputOutlined";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

type Props = {
    locations: Location[];
};

type Location = {
    province: string;
    cities: LocationRes[];
};

type LocationRes = {
    city: string;
    cityCount: number;
};

const StoresPage: React.FC<Props> = ({ locations }) => {
    const [postalCode, setPostalCode] = useState("");
    const initialArray: boolean[] = [];
    initialArray.length = locations.length;

    const [open, setOpen] = useState<boolean[]>(initialArray.fill(false, 0));

    const openHandler = (index: number) => {
        setOpen([
            ...open.slice(0, index),
            !open[index],
            ...open.slice(index + 1),
        ]);
    };

    const router = useRouter();

    const [location, setLocation] = useState("");
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
        const res = await fetch(`${API_URL}/stores?postalCode=${postalCode}`);
        const data = await res.json();
        setStores(data);
    };

    useEffect(() => {
        (async () => {
            if (page && location) {
                setStores([]);
                setTotalStores(1);
                const storeReq = await fetch(
                    `${API_URL}/stores?page=${page}&search=${location}`
                );
                const storeRes = await storeReq.json();
                setStores(storeRes.stores);
                setTotalStores(storeRes.total);
            }
        })();
    }, [page, location]);

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
                            if (
                                input.match(
                                    /^[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])[A-Z]?(?![A-Z])[0-9]?(?![0-9])$/
                                )
                            )
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
                <div className={styles["store-list__location-field"]}>
                    {locations.map((loc, i) => (
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
                                                {loc.province}{" "}
                                                {`(${loc.cities.length})`}
                                            </div>
                                            <div>
                                                {open[i] ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )}
                                            </div>
                                        </h3>
                                    </div>
                                </ListItemButton>
                            </div>
                            <Collapse in={open[i]} timeout="auto" unmountOnExit>
                                {loc.cities.map((data, i) => (
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
                    ))}
                </div>
                {location && (
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
                {postalCode || location ? (
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
