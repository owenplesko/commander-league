import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import * as relations from "./relations.ts";

const db = drizzle(process.env.DB_FILE_NAME!, {
  schema: { ...schema, ...relations },
});

export default db;

export type DB = typeof db;
