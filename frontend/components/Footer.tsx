"use client";

import styles from "../styles/Footer.module.scss";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <div className={styles["footer"]}>
      <Link href="mailto:nathan.cai.ca@gmail.com" title="Email">
        <BsGithub className={styles["footer__item"]} />
      </Link>
      <Link
        href="https://github.com/destroyer22719/FoodFlation"
        target="_blank"
        title="GitHub Repo"
      >
        <MdEmail className={styles["footer__item"]} />
      </Link>
    </div>
  );
};

export default Footer;
