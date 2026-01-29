import { os } from "@orpc/server";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export const base = os.$context<{
  headers: Headers;
  userId: string;
  env: {
    db: BunSQLiteDatabase;
  };
}>();
