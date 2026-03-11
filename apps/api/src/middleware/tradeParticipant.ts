import type { GetTradeInput } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/server";
import { authGuard } from "./auth";

export const tradeParticipant = authGuard.concat(
  async ({ context, next }, input: GetTradeInput) => {
    const request = await context.env.db.query.tradeRequest.findFirst({
      where: {
        id: input.tradeId,
        OR: [
          {
            requesterId: context.userId,
          },
          {
            recipientId: context.userId,
          },
        ],
      },
    });

    if (!request) throw new ORPCError("NOT_FOUND");

    const role =
      request.requesterId === context.userId ? "requester" : "recipient";

    return next({ context: { tradeRole: role } });
  },
);
