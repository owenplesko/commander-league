import { implement } from "@orpc/server";
import type { DB } from "./db";
import { contract } from "@commander-league/contract";

type BaseContext = {
  headers: Headers;
  env: {
    db: DB;
  };
};

export const base = implement(contract).$context<BaseContext>();
