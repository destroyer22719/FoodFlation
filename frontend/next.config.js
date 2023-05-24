/** @type {import('next').NextConfig} */
<<<<<<< HEAD
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");
// const withPlugins = require("next-compose-plugins");

// let withBundleAnalyzer;
// if (process.env.NODE_ENV !== "production") {
//   withBundleAnalyzer = require("@next/bundle-analyzer")({
//     enabled: process.env.ANALYZE === "true",
//   });
// }
=======

let withBundleAnalyzer;
if (process.env.NODE_ENV !== "production") {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
}
const { withSentryConfig } = require("@sentry/nextjs");
const million = require("million/compiler");

>>>>>>> master
const moduleExports = {
  reactStrictMode: true,
  images: {
    domains: [
      "assets.shop.loblaws.ca",
      "assets.sellers.loblaw.ca",
      "product-images.metro.ca",
      "www.metro.ca",
      "m.media-amazon.com",
      "www.instacart.com",
      "upload.wikimedia.org",
      "target.scene7.com",
    ],
  },
};

if (process.env.NODE_ENV !== "production") {
  module.exports = withBundleAnalyzer(moduleExports);
} else {
  // module.exports = million.next(moduleExports);
  // module.exports = moduleExports;

  module.exports = withSentryConfig(
    million.next(moduleExports),
    {
      silent: true,
      org: "food-flation",
      project: "frontend",
    },
    {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
    }
  );
}
