import Head from "next/head";
import * as React from "react";
import SearchBox from "./SearchBox";
import style from "../styles/Layout.module.scss";
import nav from "../styles/Nav.module.scss";
import Link from "next/link";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    title: string;
    children: React.ReactNode;
};

const buttonStyles = {
    "&.MuiButton-root": {
        border: "2px solid #9388A2",
    },
    "&.MuiButton-text": {
        color: "#9388A2",
    },
    "&.MuiButton-contained": {
        color: "#9388A2",
    },
    "&.MuiButton-outlined": {
        color: "#9388A2",
    },
};

const iconStyles = {
    fill: "#9388A2"
}

const Layout: React.FC<Props> = ({ title, children }) => {
    React.useEffect(() => {
        const body = document.querySelector("body")!;
        const html = document.querySelector("html")!;
        body.style.margin = "0";
        body.style.height = "100vh";
        html.style.height = "100vh";
    }, []);

    return (
        <div className={style["layout"]}>
            <Head>
                <title>FoodFlation | {title} </title>
                <meta
                    name="description"
                    content="Track price histories of grocery stores in Canada"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <nav className={nav["nav"]}>
                {/* <SearchBox /> */}
                <Link href={"/"} passHref>
                    <Button sx={buttonStyles} variant="outlined">
                        Home
                    </Button>
                </Link>
                <Link href={"/store/find"} passHref>
                    <Button sx={buttonStyles} variant="outlined">
                        <SearchIcon sx={iconStyles} /> Track Prices
                    </Button>
                </Link>
                <Link href={"/faq"} passHref>
                    <Button sx={buttonStyles} variant="outlined">
                        FAQ
                    </Button>
                </Link>
            </nav>
            <div>{children}</div>
        </div>
    );
};

export default Layout;
