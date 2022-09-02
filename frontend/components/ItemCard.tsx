import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Item } from "../global";
import styles from "../styles/Store.module.scss";
import ButtonOutlined from "./CustomButtonComponents/ButtonOutlined";
import CategoryButton from "./CustomButtonComponents/CategoryButton";

type Props = {
    item: Item;
};

const ItemCard: React.FC<Props> = ({ item }) => {
    const router = useRouter();

    const [date, setDate] = useState<string | null>(null);
    useState(() => {
        setDate(new Date(item.lastUpdated as Date).toISOString().split("T")[0]);
    });

    const query = { ...router.query };
    if (!query.category) {
        query.page = "1";
        query.category = item.category
            .replaceAll(" ", "%20")
            .replaceAll("&", "%26");
        query.storeId = undefined;
    }

    return (
        <div className={styles["store-page__item"]}>
            <ButtonOutlined className={styles["store-page__item-button"]}>
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
            <CategoryButton
                category={item.category}
                className={styles["store-page__item-category"]}
                linkTo={{
                    pathname: router.asPath.split("?")[0],
                    query,
                }}
            />
        </div>
    );
};

export default ItemCard;
