import { implement } from "@orpc/server";
import type { DB } from "../db";
import { contract } from "@commander-league/contract";

export const os = implement(contract).$context<{
  headers: Headers;
  userId: string;
  env: {
    db: DB;
  };
}>();
