import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreList";
import { API_URL } from "../../config";
import { Store } from "../../global";

type AppProps = {
    stores: Store[];
};

export default function StoresPage({ stores }: AppProps) {
    return (
        <Layout title="Store List">
            <p>{stores.length} Results</p>
            <div>
                {stores.map((store) => (
                    <StoreList key={store.id} store={store} />
                ))}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch(`${API_URL}/stores`);
    const stores = await res.json();
    return {
        props: {
            stores,
        },
    };
};
