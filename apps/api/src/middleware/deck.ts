import { and, eq } from "drizzle-orm";
import type { DB } from "../db";
import { deck, leagueMember } from "../db/schema";
import { base } from "../orpc";
import type { GetDeckInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";

export const deckOwner = base
  .$context<{
    userId: string;
    env: {
      db: DB;
    };
  }>()
  .middleware(async ({ context, next }, input: GetDeckInput) => {
    const deckRes = context.env.db
      .select()
      .from(deck)
      .where(eq(deck.id, input.deckId))
      .get();

    if (!deckRes) throw new ORPCError("NOT_FOUND");

    if (deckRes.userId != context.userId) throw new ORPCError("UNAUTHORIZED");

    return next();
  });

export const deckVisibile = base
  .$context<{
    userId: string;
    env: {
      db: DB;
    };
  }>()
  .middleware(async ({ context, next }, input: GetDeckInput) => {
    // user in same league as deck
    const exists = context.env.db
      .select()
      .from(deck)
      .innerJoin(leagueMember, eq(deck.leagueId, leagueMember.leagueId))
      .where(
        and(eq(deck.id, input.deckId), eq(leagueMember.userId, context.userId)),
      )
      .get();

    if (!exists) throw new ORPCError("UNAUTHORIZED");

    return next();
  });
