import { implement } from "@orpc/server";
import { contract } from "@commander-league/contract";
import { authMiddleware } from "./middleware/auth";

type BaseContext = {
  headers: Headers;
};

export const base = implement(contract).$context<BaseContext>();
export const authed = base.use(authMiddleware);
export const member = base.use(authMiddleware);
