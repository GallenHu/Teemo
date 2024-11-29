import mongoose from "mongoose";
import db from "@/utils/db";
import Category from "@/models/Category";
import Site from "@/models/Site";
import { ISiteItem } from "@/types";

export async function getSites(userId: string) {
  await db.connect();

  const s = await Site.find({ user: userId });
  return s;
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

export async function deleteSite(id: string) {
  await db.connect();

  return await Site.findByIdAndDelete(id);
}

export async function updateSite(id: string, site: ISiteItem) {
  await db.connect();

  return await Site.findByIdAndUpdate(id, site, { new: true });
}

export async function updateOrders(
  categoryId: string,
  newOrderList: ISiteItem[]
) {
  let success = false;
  // 使用事务来保证所有操作要么全部成功，要么全部失败
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of newOrderList) {
      // 更新每项的order
      await Site.updateOne(
        { category: categoryId, url: item.url }, // 匹配条件
        { $set: { order: item.order } }, // 要设置的新值
        { session } // 在事务中执行
      );
    }

    // 如果所有更新都成功，则提交事务
    await session.commitTransaction();
    console.log("Orders updated successfully.");
    success = true;
  } catch (error) {
    // 如果出现错误，则回滚事务
    await session.abortTransaction();
    console.error("Error updating orders:", error);
    success = false;
  } finally {
    // 关闭会话
    session.endSession();
    return success;
  }
}
