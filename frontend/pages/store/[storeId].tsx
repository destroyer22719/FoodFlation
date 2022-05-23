import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import ItemList from "../../components/ItemList";
import Layout from "../../components/Layout";
import { API_URL } from "../../config";
import { Item, Store } from "../../global";
import style from "../../styles/Store.module.scss";
import ButtonContained from "../../components/ButtonContained"

type Props = {
    store: Store;
    items: Item[];
    totalItems: number;
};

const StorePage: React.FC<Props> = ({ store, items, totalItems }) => {
    const router = useRouter();

    const pageSize = 15;
    const page = router.query.page ? +router.query.page : 1;
    const maxPages = Math.ceil(totalItems / pageSize);
    const currentPath = router.asPath.split("?")[0]

    return (
        <Layout title={store.name || "Store Not Found"}>
            {store.id ? (
                <div className={style["store-page"]}>
                    <h1>{store.name}</h1>
                    <p>
                        {store.street}, {store.city} {store.postalCode}
                    </p>
                    <div>{totalItems} Items Tracked</div>
                    <div className={style["store-page__pagination-buttons"]}>
                        {page !== 1 && (
                            <Link
                                passHref
                                href={`${currentPath}?page=${page - 1}`}
                            >
                                <ButtonContained>
                                    {"<"}
                                </ButtonContained>
                            </Link>
                        )}
                        <ButtonContained>
                            Page {page}/{maxPages}
                        </ButtonContained>
                        {page !== maxPages && (
                            <Link
                                passHref
                                href={`${currentPath}?page=${page + 1}`}
                            >
                                <ButtonContained>
                                    {">"}
                                </ButtonContained>
                            </Link>
                        )}
                    </div>
                    {items.map((item) => (
                        <ItemList key={item.id} item={item} />
                    ))}
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
    query: { storeId, page },
}) => {
    const storeReq = await fetch(`${API_URL}/stores/${storeId}`);
    const itemsReq = await fetch(
        `${API_URL}/items/store/${storeId}?page=${page ? +page : 1}`
    );
    const store: Store = await storeReq.json();
    const itemsRes = await itemsReq.json();

    return {
        props: {
            store,
            items: itemsRes.items,
            totalItems: itemsRes.total,
        },
    };
};

export default StorePage;
