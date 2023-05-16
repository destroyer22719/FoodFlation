import styles from "@/styles/components/Footer.module.scss";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <div className={styles["footer"]}>
      <Link href="mailto:nathan.cai.ca@gmail.com" title="Email">
        <div className={styles["footer__item--left"]}>
          <MdEmail className={styles["footer__icon"]} />
        </div>
      </Link>
      <Link
        href="https://github.com/destroyer22719/FoodFlation"
        target="_blank"
        title="GitHub Repo"
      >
        <div className={styles["footer__item--right"]}>
          <BsGithub className={styles["footer__icon"]} />
        </div>
      </Link>
    </div>
  );
};

export default Footer;
