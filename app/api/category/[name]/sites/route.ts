import z from "zod";
import { errorResponse, successResponse } from "@/utils/api-response";
import { getSitesByCategoryId } from "@/utils/db-site";
import { getCategoryByName } from "@/utils/db-category";
import { getUserIdFromRequest } from "@/lib/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  const categoryName = (await params).name;
  const matchCategory = await getCategoryByName(userId, categoryName);
  if (!matchCategory) {
    return errorResponse("Category not found");
  }

  const sites = await getSitesByCategoryId(matchCategory._id.toString());
  return successResponse(sites);
}
