import z from "zod";
import { errorResponse, successResponse } from "@/utils/api-response";
import { getSitesByCategoryId } from "@/utils/db-site";
import { getCategoryById } from "@/utils/db-category";
import { getUserIdFromRequest } from "@/lib/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  const categoryId = (await params).id;
  const matchCategory = await getCategoryById(userId, categoryId);
  if (!matchCategory) {
    return errorResponse("Category not found");
  }

  const sites = await getSitesByCategoryId(categoryId);
  return successResponse(sites);
}
