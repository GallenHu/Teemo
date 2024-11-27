import db from "@/utils/db";
import Category from "@/models/Category";
import Site from "@/models/Site";
import { ISiteItem } from "@/types";

export async function getSites(userId: string) {
  await db.connect();

  const s = await Site.find({ user: userId });
  return s;
}

export async function getSitesWithCategory(userId: string) {
  await db.connect();

  return await Site.find({ user: userId }).populate({
    path: "category",
    model: Category,
  });
}

export async function createSite(
  userId: string,
  categoryId: string,
  site: ISiteItem
) {
  await db.connect();

  const newSite = new Site({ ...site, user: userId, category: categoryId });
  await newSite.save();
  return newSite;
}

export async function deleteSite(id: string) {
  await db.connect();

  return await Site.findByIdAndDelete(id);
}

export async function updateSite(id: string, site: ISiteItem) {
  await db.connect();

  return await Site.findByIdAndUpdate(id, site, { new: true });
}
