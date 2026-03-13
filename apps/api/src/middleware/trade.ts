import type { GetTradeInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";
import { authGuard } from "./auth";
import { eq } from "drizzle-orm";
import { tradeRequest, tradeSide } from "../db/schema";

export const tradeParticipantGuard = authGuard.concat(
  async ({ context, next }, input: GetTradeInput) => {
    const participants = context.env.db
      .selectDistinct({ userId: tradeSide.userId })
      .from(tradeSide)
      .where(eq(tradeSide.tradeId, input.tradeId))
      .all()
      .map(({ userId }) => userId) as [string, string];

    if (participants.length !== 2) throw new ORPCError("INTERNAL_SERVER_ERROR");

    if (!participants.includes(context.userId))
      throw new ORPCError("NOT_FOUND");

    return next({ context: { participants } });
  },
);

export const tradeOwner = authGuard.concat(
  async ({ context, next }, input: GetTradeInput) => {
    const res = context.env.db
      .select()
      .from(tradeRequest)
      .where(eq(tradeRequest.id, input.tradeId))
      .get();

    if (!res) throw new ORPCError("NOT_FOUND");

    if (res.ownerId !== context.userId) throw new ORPCError("UNAUTHORIZED");

    return next();
  },
);
