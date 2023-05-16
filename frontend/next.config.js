/** @type {import('next').NextConfig} */

let withBundleAnalyzer;
if (process.env.NODE_ENV !== "production") {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
}

const million = require("million/compiler");

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
  module.exports = million.next(moduleExports);
  // module.exports = moduleExports;
}
