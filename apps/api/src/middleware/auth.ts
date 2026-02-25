import { ORPCError } from "@orpc/server";
import { auth } from "../auth";
import { pub } from "../orpc";

export const authGuard = pub.middleware(async ({ context, next }) => {
  const user = await auth.api.getSession({ headers: context.headers });
  const userId = user?.user.id;

  if (!userId) throw new ORPCError("UNAUTHORIZED");

  return await next({
    context: {
      userId: userId,
    },
  });
});
