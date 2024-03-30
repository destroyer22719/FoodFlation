/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

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

// if (process.env.NODE_ENV === "production") {
//   module.exports = withSentryConfig(
//     // million.next(moduleExports),
//     moduleExports,
//     {
//       silent: true,
//       org: "food-flation",
//       project: "frontend",
//     },
//     {
//       widenClientFileUpload: true,
//       transpileClientSDK: true,
//       tunnelRoute: "/monitoring",
//       hideSourceMaps: true,
//       disableLogger: true,
//     }
//   );
// } else {
  module.exports = moduleExports;
// }
