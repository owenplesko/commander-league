import type { GetTradeInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";
import { authGuard } from "./auth";
import { and, eq, exists } from "drizzle-orm";
import { tradeSide } from "../db/schema";

export const tradeParticipantGuard = authGuard.concat(
  async ({ context, next }, input: GetTradeInput) => {
    const present = exists(
      context.env.db
        .select()
        .from(tradeSide)
        .where(
          and(
            eq(tradeSide.tradeId, input.tradeId),
            eq(tradeSide.userId, context.userId),
          ),
        ),
    );

    if (!present) throw new ORPCError("NOT_FOUND");

    return next();
  },
);
