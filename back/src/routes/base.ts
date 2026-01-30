import { os } from "@orpc/server";
import type { DB } from "../db";

export const base = os.$context<{
  headers: Headers;
  userId: string;
  env: {
    db: DB;
  };
}>();
