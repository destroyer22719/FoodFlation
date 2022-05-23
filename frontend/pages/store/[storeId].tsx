import { GetServerSideProps } from "next";
import ItemList from "../../components/ItemList";
import Layout from "../../components/Layout";
import { API_URL } from "../../config";
import { Store } from "../../global";

type Props = {
    store: Store;
};

const StorePage: React.FC<Props> = ({ store }) => {
    return (
        <Layout title={store.name || "Store Not Found"}>
            {store.id ? (
                <div>
                    <h1>{store.name}</h1>
                    <p>
                        {store.street}, {store.city} {store.postalCode}
                    </p>
                    <div>{store.items.length} Items Tracked</div>
                    {store.items.map((item) => (
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
