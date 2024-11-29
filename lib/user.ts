import { type NextRequest } from "next/server";
import { getUserByEmail } from "@/utils/db-user";

export async function getUserIdFromRequest(request: NextRequest) {
  const email = request.headers.get("x-user-email") || "";
  return getUserIdByEmail(email);
}

export async function getUserIdByEmail(email: string) {
  const user = await getUserByEmail(email);
  return user?._id as string | undefined;
}
