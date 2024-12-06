import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  compiler: {
    styledComponents: true,
  },
  env: {
    // auth.js
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,

    AUTH_GITLAB_ID: process.env.AUTH_GITLAB_ID,
    AUTH_GITLAB_SECRET: process.env.AUTH_GITLAB_SECRET,

    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

    // app config
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
