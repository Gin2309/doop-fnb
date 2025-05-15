/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "*",
      "doop-dev-api.acdtech.asia",
      "doop-staging-api.acdtech.asia",
      "172.23.0.7",
      "103.75.180.105",
      "gongcha.com.vn",
    ],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: "",
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
});
