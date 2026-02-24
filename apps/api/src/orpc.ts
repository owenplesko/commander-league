import { implement, ORPCError } from "@orpc/server";
import type { DB } from "./db";
import { contract } from "@commander-league/contract";
import { auth } from "./auth";

export const pub = implement(contract).$context<{
  headers: Headers;
  env: {
    db: DB;
  };
}>();

export const authed = pub.use(async ({ context, next }) => {
  const user = await auth.api.getSession({ headers: context.headers });
  const userId = user?.user.id;

  if (!userId) throw new ORPCError("UNAUTHORIZED");

  return await next({
    context: {
      userId: userId,
    },
  });
});
