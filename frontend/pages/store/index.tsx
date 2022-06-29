import { GetServerSideProps } from "next";
import { useState } from "react";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreItem";
import { API_URL } from "../../config";
import { Store } from "../../global";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/StoreList.module.scss";
import ButtonContained from "../../components/ButtonContained";
import ButtonOutlined from "../../components/ButtonOutlined";
import { Input } from "@mui/material";
import InputOutlined from "../../components/InputOutlined";

type Props = {
    stores: Store[];
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

const StoresPage: React.FC<Props> = ({ stores = [], locations }) => {
    const [postalCode, setPostalCode] = useState("");
    const router = useRouter();

    const location = router.query.location;

    const pageSize = 15;
    const page = router.query.page ? +router.query.page : 1;
    const maxPages = Math.ceil(page / pageSize);

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
                    <Link
                        href={`/store?postalCode=${
                            postalCode.slice(0, 3) + " " + postalCode.slice(3)
                        }`}
                        passHref
                    >
                        <a>
                            <ButtonOutlined
                                className={styles["store-list__search-button"]}
                            >
                                <SearchIcon /> Find a Store
                            </ButtonOutlined>
                        </a>
                    </Link>
                </div>
                <div className={styles["store-list__location-field"]}>
                    {locations.map((loc, i) => (
                        <div
                            key={i}
                            className={styles["store-list__location-prov-col"]}
                        >
                            <h3>{loc.province}</h3>
                            <div>
                                {loc.cities.map((data, i) => (
                                    <div
                                        key={i}
                                        className={
                                            styles[
                                                "store-list__location-city-col"
                                            ]
                                        }
                                    >
                                        <Link
                                            href={`/store?location=${data.city}`}
                                        >
                                            <ButtonOutlined>
                                                {data.city.split(", ")[0]} -{" "}
                                                {data.cityCount}
                                            </ButtonOutlined>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {location && (
                    <div className={styles["store-list__pagination-buttons"]}>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                            disabled={page == 1}
                        >
                            <Link
                                href={
                                    page == 1
                                        ? "#"
                                        : `/stores?location=${location}&page=${
                                              page - 1
                                          }`
                                }
                                passHref
                            >
                                <a href="#">{"<"}</a>
                            </Link>
                        </ButtonContained>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                        >
                            <a
                                href="#"
                                className={
                                    styles["store-list__pagination-button-link"]
                                }
                            >
                                Page {page}/{maxPages}
                            </a>
                        </ButtonContained>
                        <ButtonContained
                            className={styles["store-list__pagination-button"]}
                            disabled={page == maxPages}
                        >
                            <Link
                                href={
                                    page == maxPages
                                        ? "#"
                                        : `/stores?location=${location}&page=${
                                              page + 1
                                          }`
                                }
                                passHref
                            >
                                <a
                                    href="#"
                                    className={
                                        styles[
                                            "store-list__pagination-button-link"
                                        ]
                                    }
                                >
                                    {">"}
                                </a>
                            </Link>
                        </ButtonContained>
                    </div>
                )}
                <div className={styles["store-list__list"]}>
                    {stores.map((store) => (
                        <StoreList key={store.id} store={store} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    query: { location, page, postalCode },
}) => {
    let storeReq,
        stores = [];

    if (location || postalCode) {
        storeReq = await fetch(
            `${API_URL}/stores?search=${location || ""}&page=${
                page || 1
            }&postalCode=${postalCode || ""}`
        );
        stores = await storeReq.json();
    }

    const locationRes = await fetch(`${API_URL}/stores/locations`);
    const locations = await locationRes.json();
    return {
        props: {
            locations,
            stores,
        },
    };
};

export default StoresPage;
