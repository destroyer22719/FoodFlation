import Head from "next/head";
import * as React from "react";
import SearchBox from "./SearchBox";
import style from "../styles/Layout.module.scss";

type Props = {
    title: string,
    children: React.ReactNode;
}

const Layout:React.FC<Props> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>FoodFlation | {title} </title>
                <meta
                    name="description"
                    content="Track price histories of grocery stores in Canada"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <nav>
                <SearchBox />
                <div>Home</div>
                <div>FAQ</div>
            </nav>
            <div className={style["layout"]}>{children}</div>
        </>
    );
}

export default Layout