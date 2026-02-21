import { implement } from "@orpc/server";
import type { DB } from "../db";
import { contract } from "@commander-league/contract";

export const base = implement(contract).$context<{
  headers: Headers;
  userId: string;
  env: {
    db: DB;
  };
}>();
