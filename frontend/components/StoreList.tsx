import Link from "next/link";
import { Store } from "../global";

type Props = {
    store: Store;
};

const StoreList:React.FC<Props> = ({ store }) => {
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

export default StoreList;