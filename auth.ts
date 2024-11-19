import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Gitlab from "next-auth/providers/gitlab";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    // https://authjs.dev/getting-started/authentication/credentials
    // Credentials({}),
    GitHub,
    Gitlab({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
