import Layout from "../components/Layout";

const FaqPage: React.FC<{}> = () => {
    return (
        <Layout title="FAQ">
            <h1>FAQ</h1>
            <h3>What is FoodFlation?</h3>
            <p>
                FoodFlation is a website used to track the prices of everyday
                grocery store items and its price history. This website is made
                because of rising inflation in Canada.
            </p>
            <h3>Where does FoodFlation get the prices from?</h3>
            <p>
                The prices comes from the website of the corresponding grocery
                {"store's"} website.
            </p>
            <h3>How does FoodFlation get the prices?</h3>
            <p>
                FoodFlation retrieves its prices from web scraping using a tool
                called Puppeteer made by Google.
            </p>
            <h3>
                Can you add X and Y grocery store?/ Why {"isn't"} my favourite
                grocery store on the website?
            </h3>
            <p>
                Attemps have been made to scrape for prices on a larger pool of
                grocery stores but {"it's"} difficult or impossible to do so for
                some of them. One of the main reasons being that the grocery
                {"store's"} website only contains flyers {"("}Freshco and
                NoFrills
                {")"} or there tools to shut down bots {"("}Walmart{")"}. While
                more stores will hopefully be added the current stores are the
                most ideal because {"it's"} website specifically lists the price
                of all grocery store items by location. If you have a grocery
                store that fits the criteria for scraping please contact me.
            </p>
            <h3>
                Why are there only Canadian grocery store prices? Will you add
                US grocery store prices?
            </h3>
            <p>
                I only included included prices of Canadian grocery stores
                because I live in Canada. I really do hope to add US stores, but
                a program like this stores a lot of data. This is something I
                hope to do in the next coming months after carefully observing
                storage and costs.
            </p>
            <h3>How can I support FoodFlation?</h3>
            <p>
                For the most part I would appreciate if you can spread the word
                about this website. It takes a lot of effort creating {"("}and
                dugging{")"} a website like this. I don't use ads, a Patreon or
                buymeacoffee account, paywalls, and user tracking tools such as Google
                Analytics. Because I'm not using any using tracking software I
                don't fully know how popular my website is, which is why I would
                appreciate even a simple email, which is more than enough for me.
                You can find my email at the footer on the bottom right side of
                the site. Hearing the feedback would deeply encourage me to
                spend more time on this project. If you would like to help out
                you can submit a pull request on the site's github page. If you
                would like to support in other ways please email me.
            </p>
        </Layout>
    );
};

export default FaqPage;
