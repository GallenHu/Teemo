import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";

export async function GET(request: NextRequest) {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(10 * 1000);
  return successResponse([]);
}
