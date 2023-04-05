/** @type {import('next').NextConfig} */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// const { withSentryConfig } = require("@sentry/nextjs");
let withBundleAnalyzer;
if (process.env.NODE_ENV !== "production") {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
}

const moduleExports = {
  reactStrictMode: true,
  experimental: { appDir: true },
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

// const sentryWebpackPluginOptions = {
//   // Additional config options for the Sentry Webpack plugin. Keep in mind that
//   // the following options are set automatically, and overriding them is not
//   // recommended:
//   //   release, url, org, project, authToken, configFile, stripPrefix,
//   //   urlPrefix, include, ignore

//   silent: true, // Suppresses all logs
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.
// };

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
if (process.env.NODE_ENV !== "production") {
  module.exports = withBundleAnalyzer(moduleExports);
} else {
  module.exports = moduleExports;
}
