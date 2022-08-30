import Link from "next/link";
import styles from "../styles/Nav.module.scss";
import ButtonOutlined from "./ButtonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ButtonContained from "./ButtonContained";

const Nav = () => {
    return (
        <nav className={styles["nav"]}>
            <div className={styles["nav__section"]}>
                <Link href={"/"} passHref>
                    <a href="#" className={styles["nav__item"]}>
                        <ButtonOutlined className={styles["nav__item--bold"]}>
                            Home
                        </ButtonOutlined>
                    </a>
                </Link>
            </div>
            <Link href={"/store/"} passHref>
                <a href="#" className={styles["nav__item"]}>
                    <ButtonContained className={styles["nav__item--bold"]}>
                        <SearchIcon /> Track Prices
                    </ButtonContained>
                </a>
            </Link>
            <div className={styles["nav__section"]}>
                <Link href={"/faq"} passHref>
                    <a href="#" className={styles["nav__item"]}>
                        <ButtonOutlined className={styles["nav__item--bold"]}>
                            FAQ
                        </ButtonOutlined>
                    </a>
                </Link>
                <Link href={"/about"} passHref>
                    <a href="#" className={styles["nav__item"]}>
                        <ButtonOutlined className={styles["nav__item--bold"]}>
                            About
                        </ButtonOutlined>
                    </a>
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
