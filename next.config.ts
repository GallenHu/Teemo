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

    // mongodb
    MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_USER_NAME: process.env.MONGO_USER_NAME,
    MONGO_USER_PASSWORD: process.env.MONGO_USER_PASSWORD,

    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
