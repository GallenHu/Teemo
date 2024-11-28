import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/utils/api-response";
import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   if (pathname.startsWith("/category")) {
//     if (!isAuthenticated()) {
//       return errorResponse("Unauthorized");
//     }
//   }

//   // if (request.nextUrl.pathname.startsWith("/dashboard")) {
//   //   // This logic is only applied to /dashboard
//   // }
// }

// async function isAuthenticated() {
//   const session = await auth();
//   return !!session?.user?.id;
// }
