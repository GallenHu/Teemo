import type { NextRequest } from "next/server";

export function isAuthenticated(request: NextRequest) {
  console.log(request.auth);
  // https://authjs.dev/getting-started/session-management/protecting
  // DO NOT use import @/auth here
  return !!request.auth;
}
