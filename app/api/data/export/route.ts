import { errorResponse, successResponse } from "@/utils/api-response";
import { getCategories } from "@/utils/db-category";
import { getSites } from "@/utils/db-site";
import { NextResponse, type NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/user";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  try {
    const categories = await getCategories(userId);
    const sites = await getSites(userId);

    const headers = {
      "Content-Disposition": `attachment; filename=export.json`,
      // "Content-Type": "application/json",
      "Content-Type": "text/plain",
    };
    const str = JSON.stringify(
      {
        categories,
        sites,
      },
      null,
      2
    );

    return new NextResponse(str, {
      status: 200,
      headers,
    });
  } catch (error) {
    return errorResponse("Error fetching data", 500);
  }
}
