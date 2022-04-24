import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import StoreList from "../../components/StoreList";
import { API_URL } from "../../config";
import { Store } from "../../global";

type Props = {
    stores: Store[];
};

const StoresPage: React.FC<Props> = ({ stores }) => {
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

export default StoresPage;
