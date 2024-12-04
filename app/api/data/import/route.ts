import fs, { createWriteStream } from "fs";
import path from "path";
import { errorResponse, successResponse } from "@/utils/api-response";
import { clearAndInsertMany } from "@/utils/db-category";
import { createSite, clear } from "@/utils/db-site";
import { type NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/user";
import { Readable } from "stream";
import { z } from "zod";
import { uniqBy } from "lodash-es";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized: user id not found");
  }

  const formData = await request.formData();

  const file = formData.get("file") as File;

  if (!file?.size) {
    return errorResponse("No file uploaded");
  }

  const tempFile = path.join(process.cwd(), `import_${userId}.json`);

  try {
    const str = await readTextFile(file, tempFile);
    const data = JSON.parse(str);
    const { valid, issues } = validateImportData(data);
    if (!valid) {
      console.error(issues);
      return errorResponse(JSON.stringify(issues));
    }

    handleImportData(userId, data);
    return successResponse(valid);
  } catch (e: any) {
    return errorResponse(e.message);
  }
}

async function readTextFile(file: File, tempFilePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileStream = createWriteStream(tempFilePath);
    const textReadableStream = new Readable(); // Create a new Readable stream

    file.arrayBuffer().then((buffer) => {
      textReadableStream.push(Buffer.from(buffer));
      textReadableStream.push(null); // Signal the end of the stream

      textReadableStream
        .pipe(fileStream)
        .on("finish", () => {
          const str = fs.readFileSync(tempFilePath, "utf-8");
          resolve(str);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  });
}

const itemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  icon: z.string(),
  category: z.object({
    name: z.string(),
  }),
});

const inputSchema = z.object({
  timestamp: z.string().datetime(),
  items: z.array(itemSchema), // items字段必须是一个符合itemSchema的对象数组
});

type InputType = z.infer<typeof inputSchema>;

function validateImportData(data: object) {
  let valid = true;
  let issues = [];

  try {
    const result = inputSchema.parse(data);
    valid = true;
  } catch (error: any) {
    valid = false;
    issues = error.issues;
  }

  return { valid, issues };
}

async function handleImportData(
  userId: string,
  obj: InputType
): Promise<Error | null> {
  const items = obj.items;
  const categories = items.map((item) => ({ ...item.category, user: userId }));
  const uniqCategories = uniqBy(categories, "name");
  const newCategories = await clearAndInsertMany(userId, uniqCategories);

  if (Array.isArray(newCategories)) {
    try {
      const map = {} as Record<string, string>;
      newCategories.forEach((category) => {
        map[category.name] = category._id;
      });

      await clear(userId);

      items.forEach((item) => {
        const categoryId = map[item.category.name] || "";
        if (categoryId) {
          createSite(userId, categoryId, item as any);
        }
      });

      return null;
    } catch (e) {
      return new Error("Error: failed to create sites");
    }
  } else {
    return new Error("Error: failed to create categories");
  }
}
