import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Item } from "../global";
import styles from "../styles/Store.module.scss";
import ButtonOutlined from "./ButtonOutlined";

type Props = {
    item: Item;
};

const ItemList: React.FC<Props> = ({ item }) => {
    const [date, setDate] = useState<string | null>(null);
    useState(() => {
        setDate(new Date(item.lastUpdated!).toISOString().split("T")[0]);
    });

    return (
        <ButtonOutlined className={styles["store-page__item"]}>
            <Link href={`/item/${item.id}`} passHref>
                <a href="#">
                    <div>
                        <h3>{item.name}</h3>
                        <Image
                            width={125}
                            height={125}
                            src={item.imgUrl}
                            alt={`Image of ${item.name}`}
                        />
                        <div className={styles["store-page__item-price"]}>
                            {"$"}
                            {item.price}
                        </div>
                        <div>Last Updated: {date}</div>
                    </div>
                </a>
            </Link>
        </ButtonOutlined>
    );
};

export default ItemList;
