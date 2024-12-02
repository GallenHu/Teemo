import { z } from "zod";
import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";
import {
  getCategories,
  getCategoryByName,
  createCategory,
} from "@/utils/db-category";
import { getUserIdFromRequest } from "@/lib/user";

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  const categories = await getCategories(userId);
  return successResponse(categories);
}

/**
 * 新建
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  // https://medium.com/@shivangrathore/how-to-add-typescript-types-to-request-body-in-nextjs-api-using-zod-63b74abe4b92
  const zValidator = z.object({
    name: z.string().max(20).min(2),
  });
  const json = await request.json();
  const parsed = zValidator.safeParse(json);
  if (!parsed.success) {
    // 400 status for bad request, generally means user input error
    return errorResponse(String(parsed.error.message));
  }

  const { name } = parsed.data;
  const exist = await getCategoryByName(userId, name);
  if (exist) {
    return errorResponse("Category already exists");
  }

  const category = await createCategory(userId, name);
  return successResponse(category);
}
