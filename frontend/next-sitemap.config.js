/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://foodflation.me",
    generateRobotsTxt: true, // (optional)
    exclude: ["/debug"],
    robotsTxtOptions: {
        policies: [
            {
                disallow: ["/debug"],
            },
        ],
    },
    // ...other options
};

module.exports = config;
