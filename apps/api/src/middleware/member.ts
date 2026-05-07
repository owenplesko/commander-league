import { ORPCError } from "@orpc/server";
import { eq, and } from "drizzle-orm";
import { member } from "../db/schema";
import { authMiddleware } from "./auth";

export const memberMiddleware = authMiddleware.concat(({ context, next }) => {
  if (!membership) throw new ORPCError("UNAUTHORIZED");

  return next({ context: { leagueRole: membership.role } });
});

export const leagueOwner = memberOfLeague.concat(({ context, next }) => {
  if (context.leagueRole !== "owner") throw new ORPCError("UNAUTHORIZED");

  return next();
});

export const selfOrLeagueOwner = memberOfLeague.concat(
  ({ context, next }, input: GetLeagueMemberInput) => {
    if (context.leagueRole === "owner" || context.userId === input.userId)
      return next();

    throw new ORPCError("UNAUTHORIZED");
  },
);
