import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import IconButton from "@mui/material/IconButton";
import styles from "../styles/Footer.module.scss";
import Link from "next/link";

const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <Link href="mailto:nathan.cai.ca@gmail.com" passHref>
                <a href="#">
                    <IconButton>
                        <EmailIcon className={styles["footer__item"]} />
                    </IconButton>
                </a>
            </Link>
            <Link href="https://github.com/destroyer22719/FoodFlation" passHref>
                <a href="#" target="_blank">
                    <IconButton>
                        <GitHubIcon className={styles["footer__item"]} />
                    </IconButton>
                </a>
            </Link>
        </div>
    );
};

export default Footer;
