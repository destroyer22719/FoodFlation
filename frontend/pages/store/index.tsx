import { GetServerSideProps } from "next";
import { useState } from "react";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreItem";
import { API_URL } from "../../config";
import { Store } from "../../global";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Link from "next/link";
import style from "../../styles/StoreList.module.scss";
import ButtonContained from "../../components/ButtonContained"
import ButtonOutlined from "../../components/ButtonOutlined"


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
    const [showSearch, setshowSearch] = useState(true);
    const router = useRouter();

    const location = router.query.location;

    const pageSize = 15;
    const page = router.query.page ? +router.query.page : 1;
    const maxPages = Math.ceil(page / pageSize);

    return (
        <Layout title="Store List">
            <div className={style["store-list"]}>
                <ButtonOutlined
                    onClick={() => setshowSearch(!showSearch)}
                >
                    <SearchIcon /> Find a Store
                </ButtonOutlined>
                {showSearch && (
                    <div className={style["store-list__location-field"]}>
                        {locations.map((loc, i) => (
                            <div
                                key={i}
                                className={
                                    style["store-list__location-prov-col"]
                                }
                            >
                                <h3>{loc.province}</h3>
                                <div>
                                    {loc.cities.map((data, i) => (
                                        <div
                                            key={i}
                                            className={
                                                style[
                                                    "store-list__location-city-col"
                                                ]
                                            }
                                        >
                                            <Link
                                                href={`/store?location=${data.city}`}
                                                passHref
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
                )}
                <div className={style["store-list__list"]}>
                    {stores.map((store) => (
                        <StoreList key={store.id} store={store} />
                    ))}
                </div>
                <div className={style["store-list__list-pagination-buttons"]}>
                    {location && (
                        <ButtonContained >
                            Page {page}/{maxPages}
                        </ButtonContained>
                    )}
                    {location && page !== maxPages && (
                        <Link
                            href={`/stores?location=${location}&page=${
                                page + 1
                            }`}
                            passHref
                        >
                            <ButtonContained>
                                {">"}
                            </ButtonContained>
                        </Link>
                    )}
                </div>
                {location && page !== 1 && (
                    <Link
                        href={`/stores?location=${location}&page=${page - 1}`}
                        passHref
                    >
                        <ButtonContained>
                            {"<"}
                        </ButtonContained>
                    </Link>
                )}
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    query: { location, page },
}) => {
    let storeReq,
        stores = [];

    if (location) {
        storeReq = await fetch(
            `${API_URL}/stores?search=${location}&page=${page || 1}`
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
