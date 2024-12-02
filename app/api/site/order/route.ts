import z from "zod";
import { errorResponse, successResponse } from "@/utils/api-response";
import { updateOrders } from "@/utils/db-site";
import { type NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/user";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  // https://medium.com/@shivangrathore/how-to-add-typescript-types-to-request-body-in-nextjs-api-using-zod-63b74abe4b92
  const zValidator = z.object({
    /**
     * category id
     */
    category: z.string(),
    /**
     * site list with new order property
     */
    sites: z.array(
      z.object({
        _id: z.string(),
        order: z.number(),
      })
    ),
  });

  const json = await request.json();
  const parsed = zValidator.safeParse(json);
  if (!parsed.success) {
    // 400 status for bad request, generally means user input error
    return errorResponse(String(parsed.error.message));
  }

  const { category, sites } = parsed.data;
  const success = await updateOrders(category, sites as any[]);
  return success ? successResponse({ ok: 1 }) : errorResponse();
}
