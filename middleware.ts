import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { errorResponse } from "./utils/api-response";

// https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response
export const config = {
  matcher: ["/api/category(.*)", "/api/site(.*)"],
};

export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return errorResponse("authentication failed", 401);
  }
}
