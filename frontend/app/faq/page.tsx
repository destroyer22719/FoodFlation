import Link from "next/link";

const FaqPage = () => {
  return (
    <div>
      <h2>How does FoodFlation get the data on item prices?</h2>
      <div>
        FoodFlation gets store data from web scraping store sites, the scraper
        is made using NodeJS and Puppeteer
      </div>
      <h2>Why doesn{"'"}t FoodFlation include other stores?</h2>
      <div>
        So far, the stores currently being scraped are stores with websites that
        contains information about its store prices, and, most importantly,
        doesn{"'"}t employ tools to shut down web scrapers, such as Walmart.
      </div>
      <h2>Does FoodFlation collect any personal information?</h2>
      <div>
        FoodFlation doesn{"'"}t store user information and it absoloutely doesn{"'"}t
        sell them to third parties. FoodFlation does use 2 third party tools to
        help improve the site,{" "}
        <Link
          href={"https://vercel.com/docs/concepts/analytics/privacy-policy"}
        >
          Vercel Analytics
        </Link>
        {" "} and <Link href={"https://sentry.io/privacy/"}>Sentry</Link>
      </div>
      <h2>What tech stack does FoodFlation use</h2>
      <div>
        Prior to v2, FoodFlation uses NextJS, Express, Sequelize, MySQL. In v2,
        FoodFlation uses NextJS13{"'"}s new app directory, Prisma, Apollo GraphQL,
        and MySQL. FoodFlation{"'"}s rewrite in tech stacks help create a
        performance, maintainable, and modern code base.
      </div>
    </div>
  );
};

export default FaqPage;
