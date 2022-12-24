import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import ItemCard from "../../components/ItemCard";
import Layout from "../../components/Layout";
import { API_URL } from "../../config";
import { Category, Item, Store } from "../../global";
import styles from "../../styles/Store.module.scss";
import ButtonContained from "../../components/CustomButtonComponents/ButtonContained";
import InputOutlined from "../../components/InputOutlined";
import CategoryButton from "../../components/CustomButtonComponents/CategoryButton";

type Props = {
    store: Store;
    items: Item[];
    totalItems: number;
    found: number;
    categoryData: {
        category: Category;
        categoryCount: number;
    }[];
};

const StorePage: React.FC<Props> = ({
    store,
    items,
    totalItems,
    found,
    categoryData,
}) => {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const pageSize = 15;
    const page = router.query.page ? +router.query.page : 1;
    const maxPages = Math.ceil(found / pageSize);

    const currentPath = router.asPath.split("?")[0].split("#")[0];
    const currentPathWithoutID = router.asPath.split("#")[0];

    const query = { ...router.query };
    query.storeId = undefined;
    query.page = undefined;

    const showClear = !!(router.query.search || router.query.category);

    return (
        <Layout title={store.name || "Store Not Found"}>
            {store.id ? (
                <div className={styles["store-page"]}>
                    <h1 id="header">{store.name}</h1>
                    <p>
                        {store.street}, {store.city}, {store.country} |{" "}
                        {store.postalCode ? store.postalCode : store.zipCode}
                    </p>
                    <div>{totalItems} Items Tracked</div>
                    <div className={styles["store-page__search"]}>
                        <InputOutlined
                            className={styles["store-page__search-bar"]}
                            value={search}
                            placeholder="Enter Item Name"
                            onChange={(e) =>
                                setSearch((e.target as HTMLInputElement).value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    router.push(
                                        `${currentPath}?search=${search}`
                                    );
                                }
                            }}
                        />
                        <Link href={`${currentPath}?search=${search}`} passHref>
                            <ButtonContained
                                className={styles["store-page__search-button"]}
                            >
                                <SearchIcon />
                            </ButtonContained>
                        </Link>
                    </div>
                    <div className={styles["store-page__category-list"]}>
                        <Link
                            href={
                                showClear ? `${currentPath}?page=${page}` : "#"
                            }
                            passHref
                        >
                            <IconButton
                                disabled={!showClear}
                                className={styles["store-page__category-clear"]}
                            >
                                <CloseIcon
                                    className={
                                        styles[
                                            "store-page__category-clear-icon"
                                        ]
                                    }
                                    sx={{
                                        fill: showClear
                                            ? "white"
                                            : "transparent",
                                    }}
                                />
                            </IconButton>
                        </Link>
                        <ButtonContained>{found} Items Found</ButtonContained>
                        {categoryData.map(({ category, categoryCount }) => (
                            <CategoryButton
                                key={category}
                                category={category}
                                count={categoryCount}
                                linkTo={`${currentPath}?category=${category
                                    .replaceAll(" ", "%20")
                                    .replaceAll("&", "%26")}`}
                            />
                        ))}
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
                                        : {
                                              pathname: currentPath,
                                              query: {
                                                  ...query,
                                                  page: page - 1,
                                              },
                                          }
                                }
                                className={
                                    styles["store-page__pagination-button-link"]
                                }
                            >
                                {"<"}
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
                            disabled={page >= maxPages}
                            className={styles["store-page__pagination-button"]}
                        >
                            <Link
                                passHref
                                href={
                                    page == maxPages
                                        ? "#"
                                        : {
                                              pathname: currentPath,
                                              query: {
                                                  ...query,
                                                  page: page + 1,
                                              },
                                          }
                                }
                                className={
                                    styles["store-page__pagination-button-link"]
                                }
                            >
                                {">"}
                            </Link>
                        </ButtonContained>
                    </div>
                    <div className={styles["store-page__item-list"]}>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div>No stores found </div>
                        )}
                    </div>
                    {items.length >= 8 && (
                        <ButtonContained
                            className={styles["store-page__back-to-top-button"]}
                        >
                            <Link
                                href={`${currentPathWithoutID}#header`}
                                className={
                                    styles[
                                        "store-page__back-to-top-button-link"
                                    ]
                                }
                            >
                                Back to top
                            </Link>
                        </ButtonContained>
                    )}
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
    query: { storeId, page, search, category },
}) => {
    const storeReq = await fetch(`${API_URL}/stores/${storeId}`);
    const itemsReq = await fetch(
        `${API_URL}/items/store/${storeId}?page=${page ? +page : 1}&search=${
            search || ""
        }&category=${
            category
                ? (category as string)
                      .replaceAll(" ", "%20")
                      .replaceAll("&", "%26")
                : ""
        }`
    );

    const store: Store = await storeReq.json();
    const itemsRes = await itemsReq.json();
    return {
        props: {
            store,
            items: itemsRes.items,
            totalItems: itemsRes.total,
            found: itemsRes.resultsFound,
            categoryData: itemsRes.categoryData,
        },
    };
};

export default StorePage;
