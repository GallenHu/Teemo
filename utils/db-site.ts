import db from "@/utils/db";
import Category from "@/models/Category";
import Site from "@/models/Site";
import { ISiteItem } from "@/types";

export async function getSites(userId: string) {
  await db.connect();

  return await Site.find({ user: userId });
}

/**
 * Get all sites with category object
 * @param userId
 * @returns
 */
export async function getSitesWithCategory(userId: string) {
  await db.connect();

  return await Site.find({ user: userId }).populate({
    path: "category",
    model: Category,
  });
}

/**
 * Get sites by category name
 * @param name
 * @returns
 */
export async function getSitesByCategoryId(id: string) {
  await db.connect();

  return await Site.find({ category: id });
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

export async function findOneAndUpdate(filter: any, update: any) {
  await db.connect();

  return await Site.findOneAndUpdate(filter, update);
}

export async function findOneAndDelete(filter: any) {
  await db.connect();

  return await Site.findOneAndDelete(filter);
}

export async function updateOrders(
  categoryId: string,
  newOrderList: (ISiteItem & { _id: string })[]
) {
  let success = false;

  const bulkOps = newOrderList.map(({ _id, order }) => ({
    updateOne: {
      filter: { _id, category: categoryId },
      update: { $set: { order } },
    },
  }));

  try {
    const result = await Site.bulkWrite(bulkOps);
    success = !!result;
  } catch (error) {
    console.error("更新失败:", error);
  } finally {
    return success;
  }
}
