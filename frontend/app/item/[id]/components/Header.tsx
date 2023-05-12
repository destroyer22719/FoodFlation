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
    <div className={styles["item__header"]}>
      <div onClick={() => router.back()} className={styles["item__header-back"]}>
        <IoChevronBack />
      </div>
      <div className={styles["item__header-name"]}>
        <h1>{name}</h1>
      </div>
      <Link href={`/store/${storeId}?category=${category}`}>
        <CategoryIcon category={category} />
      </Link>
    </div>
  );
};

export default Header;
