import { tradeRequest, tradeRequestCard } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";

const createTrade = base.trade.create
  .use(memberOfLeague)
  .handler(
    async ({
      input: {
        leagueId,
        requesterId,
        recipientId,
        requesterItems,
        recipientItems,
      },
      context,
    }) => {
      const tradeId = await context.env.db.transaction(async (tx) => {
        const { id: tradeId } = tx
          .insert(tradeRequest)
          .values({ leagueId, requesterId, recipientId })
          .returning({ id: tradeRequest.id })
          .get();

        await tx.insert(tradeRequestCard).values([
          ...requesterItems.cards.map((card) => ({
            tradeId,
            role: "requester" as const,
            ...card,
          })),
          ...recipientItems.cards.map((card) => ({
            tradeId,
            role: "recipient" as const,
            ...card,
          })),
        ]);

        return tradeId;
      });

      return { tradeId };
    },
  );

export const tradeRoutes = {
  create: createTrade,
};
