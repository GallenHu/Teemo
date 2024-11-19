import db from "@/utils/db";
import User from "@/models/User";
export async function getUserFromDb(email: string, pwHash: string) {
  await db.connect();

  const user = await User.findOne({ email: email, passwordHash: pwHash });

  return user;
}
