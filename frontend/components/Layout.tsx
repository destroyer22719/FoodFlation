import Head from "next/head";
import React, { useEffect } from "react";
import style from "../styles/Layout.module.scss";
import Footer from "./Footer";
import Nav from "./Nav";


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
            <Nav/>
            <div className={style["layout__main"]}>{children}</div>
            <Footer/>
        </div>
    );
};

export default Layout;
