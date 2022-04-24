import Head from "next/head";
import * as React from "react";
import SearchBox from "./SearchBox";
import style from "../styles/Layout.module.scss";
import nav from "../styles/Nav.module.scss";
import Link from "next/link";

type Props = {
    title: string;
    children: React.ReactNode;
};

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
                <Link href={"/"}>Home</Link>
                <Link href={"/store/find"}>Search Prices</Link>
                <Link href={"/faq"}>FAQ</Link>
            </nav>
            <div>{children}</div>
        </div>
    );
};

export default Layout;
