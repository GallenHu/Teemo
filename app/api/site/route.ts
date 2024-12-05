import z from "zod";
import { auth } from "@/auth";
import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";
import { getSites, getSitesWithCategory, createSite } from "@/utils/db-site";
import { getCategoryByName } from "@/utils/db-category";
import { getUserIdFromRequest } from "@/lib/user";

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  if (!category) {
    const sites = await getSites(userId);
    return successResponse(sites);
  } else {
    const sites = await getSitesWithCategory(userId);
    return successResponse(sites);
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  // https://medium.com/@shivangrathore/how-to-add-typescript-types-to-request-body-in-nextjs-api-using-zod-63b74abe4b92
  const zValidator = z.object({
    name: z.string().max(20).min(2),
    category: z.string().max(20).min(2),
    url: z.string().url(),
    icon: z.string(),
    order: z.number(),
  });

  const json = await request.json();
  const parsed = zValidator.safeParse(json);
  if (!parsed.success) {
    // 400 status for bad request, generally means user input error
    return errorResponse(String(parsed.error.message));
  }

  const { name, url, icon, category, order } = parsed.data;
  const matchCategory = await getCategoryByName(userId, category);
  if (!matchCategory) {
    return errorResponse("Category not found");
  }

  const site = await createSite(userId, matchCategory._id, {
    name,
    url,
    icon,
    order,
  });
  return successResponse(site);
}
