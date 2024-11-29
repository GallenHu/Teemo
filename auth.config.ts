import GitHub from "next-auth/providers/github";
import Gitlab from "next-auth/providers/gitlab";
import type { NextAuthConfig } from "next-auth";

export default {
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
} satisfies NextAuthConfig;
