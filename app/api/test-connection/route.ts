import { type NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/api-response";
import db from "@/utils/db";

export async function GET(request: NextRequest) {
  const mongoose = await db.connect();
  const collections = await mongoose.connection.db.listCollections().toArray();
  return successResponse(collections?.length);
}
