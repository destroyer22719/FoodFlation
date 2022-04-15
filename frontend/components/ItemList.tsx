import Image from "next/image";
import Link from "next/link";
import { Item } from "../global";
import { sortItemPricesByDate } from "../utli";

type AppProps = {
    item: Item;
};

export default function ItemList({ item }: AppProps) {
    item.prices = sortItemPricesByDate(item.prices);

    return (
        <Link href={`/item/${item.id}`} passHref>
            <a href="#">
                <h3>{item.name}</h3>
                <Image width={125} height={125} src={item.imgUrl} alt={`Image of ${item.name}`} />
                <div>{"$"}{item.prices[0].price}</div>
            <div>Last Updated: {new Date(item.prices[0].createdAt).toLocaleString("en-US")}</div>
            </a>
        </Link>
    );
}
