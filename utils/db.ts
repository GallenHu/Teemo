// https://github.com/AhmedAlqurafi/next-auth-credentials/blob/main/utils/db.ts
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Invalid/Missing environment variable in utils: "MONGODB_URI"'
  );
}

const MONGODB_URI = process.env.MONGODB_URI!;

//@ts-ignore
let cached = global.mongoose;

if (!cached) {
  //@ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

async function disconnect() {
  await mongoose.disconnect();
}

const db = { connect, disconnect };
export default db;
