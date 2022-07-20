import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/Faq.module.scss";

const FaqPage: React.FC<null> = () => {
    return (
        <Layout title="FAQ">
            <div className={styles["faq"]}>
                <h1>FAQ</h1>
                <h3>What is FoodFlation?</h3>
                <p>
                    FoodFlation is a website used to track the prices of
                    everyday grocery store items and its price history. This
                    website is made because of rising inflation in Canada.
                </p>
                <h3>Where does FoodFlation get the prices from?</h3>
                <p>
                    The prices comes from the website of the corresponding
                    grocery
                    {"store's"} website.
                </p>
                <h3>How does FoodFlation get the prices?</h3>
                <p>
                    FoodFlation retrieves its prices from web scraping using a
                    tool called Puppeteer made by Google.
                </p>
                <h3>
                    Can you add X and Y grocery store?/ Why {"isn't"} my
                    favourite grocery store on the website?
                </h3>
                <p>
                    Attemps have been made to scrape for prices on a larger pool
                    of grocery stores but {"it's"} difficult or impossible to do
                    so for some of them. One of the main reasons being that the
                    grocery
                    {"store's"} website only contains flyers {"("}Freshco and
                    NoFrills
                    {")"} or there tools to shut down bots {"("}Walmart{")"}.
                    While more stores will hopefully be added the current stores
                    are the most ideal because {"it's"} website specifically
                    lists the price of all grocery store items by location. If
                    you have a grocery store that fits the criteria for scraping
                    please contact me.
                </p>
                <h3>
                    Why are there only Canadian grocery store prices? Will you
                    add US grocery store prices?
                </h3>
                <p>
                    Stay tuned for more updates! FoodFlation is still new and
                    plans to include more stores from more countries are on the
                    way! {"It's"} still not too late to track prices of new grocery
                    stores as unfortunately inflation is still raging on in the
                    economy with no end in sight.
                </p>
                <h3>How can I support FoodFlation?</h3>
                <p>
                    For the most part I would appreciate if you can spread the
                    word about this website. It takes a lot of effort creating{" "}
                    {"("}and dugging{")"} a website like this. I don{"'"}t use
                    ads, a Patreon or buymeacoffee account, paywalls, and
                    privacy invasive tracking like Google Analytics. You can
                    find my email at the footer on the bottom right side of the
                    site. Hearing the feedback would deeply encourage me to
                    spend more time on this project. If you would like to help
                    out you can submit a pull request on the site
                    {"'"}s github page. If you would like to support in other
                    ways please email me.
                </p>
                <h3>Does FoodFlation respect my privacy?</h3>
                <p>
                    FoodFlation itself does keep of any user data from its
                    users, so there is no personal information to sell to third
                    parties in the first place. However, FoodFlation does use 2
                    main third-party tools to monitor the state of the website.
                    The first is Sentry which is a monitoring tool for error
                    logging. Sentry does use cookies. The second tool is
                    TinyAnalytics, which was specifically chosen as an
                    alternative to Google Analytics to respect the privacy of
                    users. TinyAnalytics {"doesn't"} use cookies. Both of these
                    are used with good intentions and are 100% anonymous data
                    which are used to improve the website. You can read the
                    privacy policy of{" "}
                    <Link href={"https://sentry.io/privacy/"}>Sentry</Link> and{" "}
                    <Link href={"https://tinyanalytics.io/privacy-policy"}>
                        TinyAnalytics
                    </Link>{" "}
                    for more information.
                </p>
            </div>
        </Layout>
    );
};

export default FaqPage;
