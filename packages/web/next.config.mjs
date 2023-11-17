// used to validate env variables at build time
// to skip validation, set SKIP_ENV_VALIDATION=true
import "./src/env.mjs";

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for RainbowKit
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Support SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    return config;
  },
};

const config = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);

export default config;
