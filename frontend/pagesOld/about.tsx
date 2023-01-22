import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/About.module.scss";

const AboutPage: React.FC = () => {
  return (
    <Layout title={"About"}>
      <div className={styles["about"]}>
        <h1>About Food Flation</h1>
        <div>
          Food flation is made to track price history of items in a variety of
          different grocery stores Canada and now the USA from companies
          including Loblaws and Metro with more on the way. FoodFlation is made
          to help people gauge the reality of inflation of grocery store items,
          beyond just a simple number because economics is more complicated than
          that. For more information visit the{" "}
          <Link href={"/faq"}>FAQ Page</Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
