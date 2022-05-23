import Image from "next/image";
import Link from "next/link";
import { Item } from "../global";
import styles from "../styles/Store.module.scss";
import ButtonOutlined from "./ButtonOutlined";

type Props = {
    item: Item;
};

const ItemList: React.FC<Props> = ({ item }) => {
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
                            <div>
                                Last Updated:{" "}
                                {new Date(item.lastUpdated!).toLocaleString(
                                    "en-US"
                                )}
                            </div>
                        </div>
                    </a>
                </Link>
            </ButtonOutlined>
    );
};

export default ItemList;
