import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const db = drizzle(process.env.DB_FILE_NAME!, {
  schema,
});

export default db;

export type DB = typeof db;
