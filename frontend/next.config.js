/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = () => {

    return {
        reactStrictMode: true,
        images: {
            domains: [
                "assets.shop.loblaws.ca",
                "assets.sellers.loblaw.ca",
                "product-images.metro.ca",
                "www.metro.ca",
            ],
        },
    };
};

const sentryWebpackPluginOptions = {
    silent: true, 
};

module.exports = withSentryConfig(moduleExports(), sentryWebpackPluginOptions);
