"use client";

import CategoryIcon from "@/components/CategoryIcon";
import Link from "next/link";
import { FC } from "react";
import { IoChevronBack } from "react-icons/io5";

import styles from "@/styles/pages/Item.module.scss";
import { useRouter } from "next/navigation";

type Props = {
  storeId: string;
  name: string;
  category: string;
};

const Header: FC<Props> = ({ category, name, storeId }) => {
  const router = useRouter();
  return (
    <>
      <div className={styles["item__header-desktop"]}>
        <div
          onClick={() => router.back()}
          className={styles["item__header-desktop-back"]}
        >
          <IoChevronBack />
        </div>
        <div className={styles["item__header-desktop-name"]}>
          <h1>{name}</h1>
        </div>
        <Link href={`/store/${storeId}?category=${category}`}>
          <CategoryIcon category={category} />
        </Link>
      </div>
      <div className={styles["item__header-mobile"]}>
        <div className={styles["item__header-mobile-name"]}>
          <h1>{name}</h1>
        </div>
        <div className={styles["item__header-mobile-buttons"]}>
          <div
            onClick={() => router.back()}
            className={styles["item__header-mobile-back"]}
          >
            <IoChevronBack />
          </div>
          <Link href={`/store/${storeId}?category=${category}`}>
            <CategoryIcon category={category} format={false} className={styles["item__header-mobile-category"]} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
