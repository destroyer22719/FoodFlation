import { GetServerSideProps } from "next";
import StoreList from "../../components/StoreList";
import { API_URL } from "../../config";
import { Store } from "../../global";

type AppProps = {
    stores: Store[];
};

export default function StoresPage({ stores }: AppProps) {
    return (
        <div>
            <p>{stores.length} Results</p>
            {stores.map((store) => (
                <StoreList key={store.id} store={store} />
            ))}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch(`${API_URL}/store`);
    const stores = await res.json();
    return {
        props: {
            stores,
        },
    };
};
