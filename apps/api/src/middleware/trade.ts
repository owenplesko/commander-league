import type { GetTradeInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";
import { authGuard } from "./auth";

type TradeRole = "requester" | "recipient";

export const tradeParticipantGuard = authGuard.concat(
  async ({ context, next }, input: GetTradeInput) => {
    const trade = await context.env.db.query.tradeRequest.findFirst({
      where: { id: input.tradeId },
    });

    if (!trade) throw new ORPCError("NOT_FOUND");

    if (
      context.userId !== trade.requesterId &&
      context.userId !== trade.recipientId
    )
      throw new ORPCError("UNAUTHORIZED");

    const tradeRole: TradeRole =
      context.userId === trade.requesterId ? "requester" : "recipient";

    return next({ context: { tradeRole } });
  },
);

export const tradeRequesterGuard = tradeParticipantGuard.concat(
  ({ context, next }) => {
    if (context.tradeRole !== "requester") throw new ORPCError("UNAUTHORIZED");
    return next();
  },
);
