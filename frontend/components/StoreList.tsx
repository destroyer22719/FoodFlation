import Link from "next/link";
import { Store } from "../global";

type AppProps = {
    store: Store;
};

export default function StoreList({ store }: AppProps) {
    return (
        <div>
            <Link href={`/store/${store.id}`} passHref>
                <a href="#">
                    <div>{store.name}</div>
                    <div>
                        {store.street}
                        {store.city}
                        {store.postalCode}
                    </div>
                </a>
            </Link>
        </div>
    );
}
