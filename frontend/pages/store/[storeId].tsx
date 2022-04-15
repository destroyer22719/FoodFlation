import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { API_URL } from "../../config";
import { Store } from "../../global";

type AppProps = {
    store: Store;
};

export default function StorePage({ store }: AppProps) {
    return (
        <Layout title={store.name || "Store Not Found"}>
            {store.id ? (
                <div>
                    <h1>{store.name}</h1>
                    <p>
                        {store.street}, {store.city} {store.postalCode}
                    </p>
                </div>
            ) : (
                <div>
                    <h1>Store not found</h1>
                </div>
            )}
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    query: { storeId },
}) => {
    const res = await fetch(`${API_URL}/stores/${storeId}`);
    console.log(`${API_URL}/store/${storeId}`);
    const store: Store = await res.json();

    return {
        props: {
            store,
        },
    };
};
