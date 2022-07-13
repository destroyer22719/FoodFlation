import type { GetServerSideProps } from "next";
import CarouselComponent from "../components/CarouselComponent";
import Layout from "../components/Layout";
import { API_URL } from "../config";
import style from "../styles/Index.module.scss";

type Props = {
    itemCount: number;
    storeCount: number;
};

const Home: React.FC<Props> = ({ itemCount, storeCount }) => {
    return (
        <Layout title={"Home"}>
            <div className={style["home"]}>
                <h1>FoodFlation</h1>
                <p>
                    Tracking prices of {itemCount} different items in{" "}
                    {storeCount} different stores across Canada
                </p>
            </div>
            <CarouselComponent />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const itemCountReq = await fetch(`${API_URL}/items/count`);
    const storeCountReq = await fetch(`${API_URL}/stores/count`);

    const itemCount = await itemCountReq.json();
    const storeCount = await storeCountReq.json();

    return {
        props: { itemCount: itemCount.count, storeCount: storeCount.count },
    };
};

export default Home;
