"use client";

import Link from "next/link";
import styles from "@/styles/Nav.module.scss";
import { MdSearch } from "react-icons/md";

const Nav = () => {
  return (
    <nav className={styles["nav"]}>
      <div className={styles["nav__section"]}>
        <Link href={"/"} className={styles["nav__item"]}>
          Home
        </Link>
      </div>
      <div className={styles["nav__item--center"]}>
        <Link href={"/store/"} className={styles["nav__item"]}>
          <MdSearch /> Search Stores
        </Link>
        <Link href={"/search/"} className={styles["nav__item"]}>
          <MdSearch /> Search Items
        </Link>
      </div>
      <div className={styles["nav__section"]}>
        <Link href={"/faq"} className={styles["nav__item"]}>
          FAQ
        </Link>
        <Link href={"/about"} className={styles["nav__item"]}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
