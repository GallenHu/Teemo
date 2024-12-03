import db from "@/utils/db";
import { auth } from "@/auth";
import Category from "@/models/Category";

export async function getCategories(userId: string) {
  await db.connect();

  return await Category.find({ user: userId });
}

export async function findOneAndUpdate(filter: any, update: any) {
  await db.connect();

  return await Category.findOneAndUpdate(filter, update);
}

export async function findOneAndDelete(filter: any) {
  await db.connect();

  return await Category.findOneAndDelete(filter);
}

export async function getCategoryById(userId: string, id: string) {
  await db.connect();

  return await Category.findOne({ user: userId, _id: id });
}

export async function getCategoryByName(userId: string, name: string) {
  await db.connect();

  return await Category.findOne({ user: userId, name });
}

export async function createCategory(userId: string, name: string) {
  await db.connect();

  const category = new Category({ user: userId, name });
  await category.save();
  return category;
}
