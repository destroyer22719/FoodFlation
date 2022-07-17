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
        const body = document.querySelector("body");
        const html = document.querySelector("html");
        if (body && html) {
            body.style.margin = "0";
            body.style.backgroundColor = "#0E050F";
            body.style.height = "100vh";
            html.style.height = "100vh";
        }
    }, []);

    return (
        <div className={style["layout"]}>
            <Head>
                <title>FoodFlation | {title || ""} </title>
                <meta
                    name="description"
                    content="Track price histories of grocery stores across Canada"
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta charSet="UTF-8"/>
                <link rel="icon" href="/favicon.png" />
                <script defer src="https://app.tinyanalytics.io/pixel/n2OJi9KSulHAKMtQ"></script>
            </Head>
            <Nav />
            <div className={style["layout__main"]}>{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
