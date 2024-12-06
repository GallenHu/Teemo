import GitHub from "next-auth/providers/github";
import Gitlab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  // generate by a tool like https://generate-secret.vercel.app/32
  secret: process.env.AUTH_SECRET,
  // https://authjs.dev/getting-started/deployment#auth_trust_host
  trustHost: Boolean(process.env.AUTH_TRUST_HOST),
  providers: [
    // https://authjs.dev/getting-started/authentication/credentials
    // Credentials({}),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Gitlab({
      clientId: process.env.AUTH_GITLAB_ID,
      clientSecret: process.env.AUTH_GITLAB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
} satisfies NextAuthConfig;
