import z from "zod";
import { auth } from "@/auth";
import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";
import {
  getSites,
  getSitesWithCategory,
  getSitesByCategoryId,
} from "@/utils/db-site";
import { getCategoryByName } from "@/utils/db-category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse("Unauthorized");
  }

  const categoryName = (await params).name;
  const matchCategory = await getCategoryByName(userId, categoryName);
  if (!matchCategory) {
    return errorResponse("Category not found");
  }

  const sites = await getSitesByCategoryId(matchCategory._id.toString());
  return successResponse(sites);
}
