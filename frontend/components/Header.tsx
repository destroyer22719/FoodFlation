import Head from "next/head";

export default function HeaderComponent({ title = "Home" }) {
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
                <div>Home</div>
                <div>FAQ</div>
            </nav>
        </>
    );
}
