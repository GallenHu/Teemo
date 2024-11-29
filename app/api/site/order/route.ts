import { errorResponse, successResponse } from "@/utils/api-response";
import { updateOrders } from "@/utils/db-site";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const success = await updateOrders("1", {});
  return success ? successResponse({ ok: 1 }) : errorResponse();
}
