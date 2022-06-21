import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Store } from "../global";
import ButtonContained from "./ButtonContained";
import style from "../styles/StoreList.module.scss";

type Props = {
    store: Store;
};

const StoreItem: React.FC<Props> = ({ store }) => {
    return (
        <div className={style["store-list__store-item"]}>
            <ButtonContained>
                <Link href={`/store/${store.id}`} passHref>
                    <a
                        href="#"
                        className={style["store-list__store-item--format"]}
                    >
                            <img
                                className={
                                    style["store-list__store-item-image"]
                                }
                                src={`/${store.name.toLocaleLowerCase()}-logo.png`}
                                alt={store.name}
                            />
                        <div
                            className={style["store-list__store-item-address"]}
                        >
                            <span>{store.street}</span>
                            <span>{store.city}</span>
                            <span>{store.postalCode}</span>
                        </div>
                    </a>
                </Link>
            </ButtonContained>
        </div>
    );
};

export default StoreItem;
