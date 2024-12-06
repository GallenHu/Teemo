import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getClient } from "./lib/db";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Do Not use getClient() directly in this file
  adapter: MongoDBAdapter(() => getClient()),
  session: { strategy: "jwt" },
  ...authConfig,
});
