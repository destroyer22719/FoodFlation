import type { NextPage } from "next";
import Layout from "../components/Layout";

const Home: NextPage = () => {
    return (
        <Layout title={"Home"}>
            <h1>FoodFLation</h1>
            <p>Tracking prices in different stores around Canada</p>
        </Layout>
    );
};

export default Home;
