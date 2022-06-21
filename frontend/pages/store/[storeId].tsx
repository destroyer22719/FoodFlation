import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import ItemList from "../../components/ItemList";
import Layout from "../../components/Layout";
import { API_URL } from "../../config";
import { Item, Store } from "../../global";
import styles from "../../styles/Store.module.scss";
import ButtonContained from "../../components/ButtonContained";
import { useState } from "react";
import InputOutlined from "../../components/InputOutlined";
import ButtonOutlined from "../../components/ButtonOutlined";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    store: Store;
    items: Item[];
    totalItems: number;
    found: number;
};

const StorePage: React.FC<Props> = ({ store, items, totalItems, found }) => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const pageSize = 15;
    const page = router.query.page ? +router.query.page : 1;
    const maxPages = Math.ceil(found / pageSize);
    const currentPath = router.asPath.split("?")[0];

    return (
        <Layout title={store.name || "Store Not Found"}>
            {store.id ? (
                <div className={styles["store-page"]}>
                    <h1>{store.name}</h1>
                    <p>
                        {store.street}, {store.city} {store.postalCode}
                    </p>
                    <div>{totalItems} Items Tracked</div>
                    <div className={styles["store-page__search"]}>
                        <InputOutlined
                            className={styles["store-page__search-bar"]}
                            value={search}
                            placeholder="Enter Postal Code of Store"
                            onChange={(e) =>
                                setSearch((e.target as HTMLInputElement).value)
                            }
                        />
                        <Link href={`${currentPath}?search=${search}`} passHref>
                            <a>
                                <ButtonOutlined
                                    className={
                                        styles["store-page__search-button"]
                                    }
                                >
                                    <SearchIcon />
                                </ButtonOutlined>
                            </a>
                        </Link>
                    </div>
                    <div className={styles["store-page__pagination-buttons"]}>
                        <ButtonContained
                            disabled={page == 1}
                            className={styles["store-page__pagination-button"]}
                        >
                            <Link
                                passHref
                                href={
                                    page == 1
                                        ? "#"
                                        : `${currentPath}?page=${page - 1}`
                                }
                            >
                                <a
                                    href="#"
                                    className={
                                        styles[
                                            "store-page__pagination-button-link"
                                        ]
                                    }
                                >
                                    {"<"}
                                </a>
                            </Link>
                        </ButtonContained>
                        <ButtonContained
                            className={styles["store-page__pagination-button"]}
                        >
                            <a
                                href="#"
                                className={
                                    styles["store-page__pagination-button-link"]
                                }
                            >
                                {" "}
                                Page {page}/{maxPages}
                            </a>
                        </ButtonContained>
                        <ButtonContained
                            disabled={page == maxPages}
                            className={styles["store-page__pagination-button"]}
                        >
                            <Link
                                passHref
                                href={
                                    page == maxPages
                                        ? "#"
                                        : `${currentPath}?page=${page + 1}`
                                }
                            >
                                <a
                                    href="#"
                                    className={
                                        styles[
                                            "store-page__pagination-button-link"
                                        ]
                                    }
                                >
                                    {">"}
                                </a>
                            </Link>
                        </ButtonContained>
                    </div>
                    <div className={styles["store-page__item-list"]}>
                        {items.map((item) => (
                            <ItemList key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Store Not Found</h1>
                </div>
            )}
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    query: { storeId, page, search },
}) => {
    const storeReq = await fetch(`${API_URL}/stores/${storeId}`);
    const itemsReq = await fetch(
        `${API_URL}/items/store/${storeId}?page=${page ? +page : 1}&search=${
            search || ""
        }`
    );
    const store: Store = await storeReq.json();
    const itemsRes = await itemsReq.json();
    return {
        props: {
            store,
            items: itemsRes.items,
            totalItems: itemsRes.total,
            found: itemsRes.resultsFound[0].resultsFound,
        },
    };
};

export default StorePage;
