import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations.ts";

const sqlite = new Database(process.env.DB_FILE_NAME ?? "db.sqlite");

sqlite.run("PRAGMA foreign_keys = ON;");

const db = drizzle({ client: sqlite, relations, casing: "snake_case" });

export default db;
export type DB = typeof db;
export type TX = Parameters<Parameters<DB["transaction"]>[0]>[0];

export type QueryClient = DB | TX;
