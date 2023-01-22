import Link from "next/link";
import styles from "@/styles/Nav.module.scss";
import ButtonOutlined from "./CustomButtonComponents/ButtonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ButtonContained from "./CustomButtonComponents/ButtonContained";

const Nav = () => {
  return (
    <nav className={styles["nav"]}>
      <div className={styles["nav__section"]}>
        <Link href={"/"} className={styles["nav__item"]}>
          <ButtonOutlined className={styles["nav__item--bold"]}>
            Home
          </ButtonOutlined>
        </Link>
      </div>
      <div className={styles["nav__item--center"]}>
        <Link href={"/store/"} className={styles["nav__item"]}>
          <ButtonContained className={styles["nav__item--bold"]}>
            <SearchIcon /> Search Stores
          </ButtonContained>
        </Link>
        <Link href={"/search/"} className={styles["nav__item"]}>
          <ButtonContained className={styles["nav__item--bold"]}>
            <SearchIcon /> Search Items
          </ButtonContained>
        </Link>
      </div>
      <div className={styles["nav__section"]}>
        <Link href={"/faq"} className={styles["nav__item"]}>
          <ButtonOutlined className={styles["nav__item--bold"]}>
            FAQ
          </ButtonOutlined>
        </Link>
        <Link href={"/about"} className={styles["nav__item"]}>
          <ButtonOutlined className={styles["nav__item--bold"]}>
            About
          </ButtonOutlined>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
