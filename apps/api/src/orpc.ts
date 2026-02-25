import { implement } from "@orpc/server";
import type { DB } from "./db";
import { contract } from "@commander-league/contract";

type BaseContext = {
  headers: Headers;
  env: {
    db: DB;
  };
};

export const pub = implement(contract).$context<BaseContext>();
