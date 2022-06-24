import Link from "next/link";
import styles from "../styles/Nav.module.scss";
import ButtonOutlined from "./ButtonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Nav = () => {
    return (
        <nav className={styles["nav"]}>
            {/* <SearchBox /> */}
            <Link href={"/"} passHref>
                <a href="#">
                    <ButtonOutlined>Home</ButtonOutlined>
                </a>
            </Link>
            <Link href={"/store/"} passHref>
                <a href="#">
                    <ButtonOutlined>
                        <SearchIcon /> Track Prices
                    </ButtonOutlined>
                </a>
            </Link>
            <Link href={"/faq"} passHref>
                <a href="#">
                    <ButtonOutlined>FAQ</ButtonOutlined>
                </a>
            </Link>
        </nav>
    );
};

export default Nav;
