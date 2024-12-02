import z from "zod";
import { errorResponse, successResponse } from "@/utils/api-response";
import { findOneAndUpdate } from "@/utils/db-category";
import { getUserIdFromRequest } from "@/lib/user";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  // https://medium.com/@shivangrathore/how-to-add-typescript-types-to-request-body-in-nextjs-api-using-zod-63b74abe4b92
  const zValidator = z.object({
    name: z.string().max(20).min(1),
    order: z.number().max(999).min(0),
  });
  const json = await request.json();
  const parsed = zValidator.safeParse(json);

  if (!parsed.success) {
    // 400 status for bad request, generally means user input error
    return errorResponse(String(parsed.error.message));
  }

  const { name, order } = parsed.data;

  const id = (await params).id;
  const filter = { _id: id, user: userId };
  const update = { name, order };

  const oldDoc = await findOneAndUpdate(filter, update);

  if (oldDoc) {
    return successResponse(oldDoc);
  } else {
    return errorResponse("Category not found");
  }
}
