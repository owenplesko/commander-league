import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations.ts";

const sqlite = new Database(process.env.DB_FILE_NAME!);

sqlite.run("PRAGMA foreign_keys = ON;");

const db = drizzle({ client: sqlite, relations });

export default db;
export type DB = typeof db;
