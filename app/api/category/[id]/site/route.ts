import z from "zod";
import { auth } from "@/auth";
import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";
import { getSites, getSitesWithCategory, createSite } from "@/utils/db-site";
import { getCategoryByName } from "@/utils/db-category";

export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse("Unauthorized");
  }
}
