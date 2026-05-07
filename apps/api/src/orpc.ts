import { implement } from "@orpc/server";
import { contract } from "@commander-league/contract";
import { authMiddleware } from "./middleware/auth";
import { adminMiddleware, memberMiddleware } from "./middleware/member";

type BaseContext = {
  headers: Headers;
};

export const base = implement(contract).$context<BaseContext>();
export const authed = base.use(authMiddleware);
export const member = base.use(memberMiddleware);
export const admin = base.use(adminMiddleware);
