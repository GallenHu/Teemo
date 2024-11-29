import db from "@/utils/db";
import User, { type Users } from "@/models/User";

export async function getUserByEmail(email: string): Promise<Users | null> {
  await db.connect();

  const user = await User.findOne({ email: email });

  return user;
}
