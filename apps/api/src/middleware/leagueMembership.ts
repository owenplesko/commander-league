import { ORPCError } from "@orpc/server";
import { eq, and } from "drizzle-orm";
import { leaguePlayer } from "../db/schema";
import type { GetLeagueInput } from "@commander-league/contract/schemas";
import { authGuard } from "./auth";

export const leagueMemberGuard = authGuard.concat(
  ({ context, next }, input: GetLeagueInput) => {
    const membership = context.env.db
      .select()
      .from(leaguePlayer)
      .where(
        and(
          eq(leaguePlayer.leagueId, input.leagueId),
          eq(leaguePlayer.playerId, context.userId),
        ),
      )
      .get();

    if (!membership) throw new ORPCError("UNAUTHORIZED");

    return next({ context: { leagueRole: membership.role } });
  },
);

export const leagueOwnerGuard = leagueMemberGuard.concat(
  ({ context, next }) => {
    if (context.leagueRole !== "owner") throw new ORPCError("UNAUTHORIZED");

    return next();
  },
);
