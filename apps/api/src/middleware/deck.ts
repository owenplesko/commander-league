import { and, eq } from "drizzle-orm";
import type { DB } from "../db";
import { deck, member } from "../db/schema";
import { public } from "../orpc";
import type { GetDeckInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";

export const deckOwner = public
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

export const deckVisibile = public
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
      .innerJoin(member, eq(deck.leagueId, member.leagueId))
      .where(and(eq(deck.id, input.deckId), eq(member.userId, context.userId)))
      .get();

    if (!exists) throw new ORPCError("UNAUTHORIZED");

    return next();
  });
