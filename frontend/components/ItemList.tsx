import Image from "next/image";
import Link from "next/link";
import { Item } from "../global";

type Props = {
    item: Item;
};

const ItemList: React.FC<Props> = ({ item }) => {
    return (
        <Link href={`/item/${item.id}`} passHref>
            <div>
                <h3>{item.name}</h3>
                <Image
                    width={125}
                    height={125}
                    src={item.imgUrl}
                    alt={`Image of ${item.name}`}
                />
                <div>
                    {"$"}
                    {item.price}
                </div>
                <div>
                    Last Updated:{" "}
                    {new Date(item.lastUpdated!).toLocaleString("en-US")}
                </div>
            </div>
        </Link>
    );
};

export default ItemList;
