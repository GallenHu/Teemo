import { errorResponse, successResponse } from "@/utils/api-response";
import { getCategories } from "@/utils/db-category";
import { getSitesWithCategory } from "@/utils/db-site";
import { NextResponse, type NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/user";
import { pick } from "lodash-es";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  try {
    const sites = await getSitesWithCategory(userId);
    const parsedSites = sites.map((site) => {
      const category = pick(site.category, ["name", "order"]);
      return {
        ...pick(site, ["name", "order", "url", "icon"]),
        category,
      };
    });
    const headers = {
      "Content-Disposition": `attachment; filename=export.json`,
      // "Content-Type": "application/json",
      "Content-Type": "text/plain",
    };
    const str = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        items: parsedSites,
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
