import { os } from "@orpc/server";
import { collectionRoutes } from "./collection";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export const base = os.$context<{ db: BunSQLiteDatabase }>();

export const router = {
  collection: collectionRoutes,
};
