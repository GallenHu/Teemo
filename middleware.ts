import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { errorResponse } from "./utils/api-response";

// https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  if (
    pathname.startsWith("/api/category") ||
    pathname.startsWith("/api/site")
  ) {
    if (!req.auth?.user?.email) {
      return errorResponse("authentication failed", 401);
    } else {
      const headers = addEmailInfoToHeaders(req, req.auth.user.email);
      return overrideRequestHeaders(headers);
    }
  }
});

function addEmailInfoToHeaders(req: NextRequest, email: string) {
  const headers = new Headers(req.headers);
  // Add a new request header
  headers.set("x-user-email", email);
  return headers;
}

function overrideRequestHeaders(headers: NextRequest["headers"]) {
  const resp = NextResponse.next({
    // New option `request.headers` which accepts a Headers object
    // overrides request headers with the specified new ones.
    request: {
      headers,
    },
  });
  // You can still set *response* headers to the client, as before.
  // resp.headers.set("x-hello-client", "bar");
  return resp;
}
