import Head from "next/head";
import React, { useEffect } from "react";
import style from "../styles/Layout.module.scss";
import nav from "../styles/Nav.module.scss";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ButtonOutlined from "./ButtonOutlined";

type Props = {
    title: string;
    children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ title, children }) => {
    useEffect(() => {
        const body = document.querySelector("body")!;
        const html = document.querySelector("html")!;
        body.style.margin = "0";
        body.style.backgroundColor = "#0E050F";
        body.style.height = "100vh";
        html.style.height = "100vh";
    }, []);

    return (
        <div className={style["layout"]}>
            <Head>
                <title>FoodFlation | {title || ""} </title>
                <meta
                    name="description"
                    content="Track price histories of grocery stores in Canada"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <nav className={nav["nav"]}>
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
            <div className={style["layout__main"]}>{children}</div>
        </div>
    );
};

export default Layout;
