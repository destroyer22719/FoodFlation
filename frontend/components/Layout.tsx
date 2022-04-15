import Head from "next/head";
import { ReactChild, ReactChildren } from "react";
import SearchBox from "./SearchBox";

type AppProps = {
    title?: string,
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export default function Layout({ title = "Home", children }: AppProps) {
    return (
        <>
            <Head>
                <title>FoodFlation | {title} </title>
                <meta
                    name="description"
                    content="Track price histories of grocery stores in Canada"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav>
                <SearchBox />
                <div>Home</div>
                <div>FAQ</div>
            </nav>
            {children}
        </>
    );
}
