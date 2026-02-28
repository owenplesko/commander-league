import { tradeRequest, tradeRequestCard } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";

const listTrades = base.trade.list
  .use(memberOfLeague)
  .handler(({ input, context }) => {
    const res = context.env.db.query.tradeRequest.findMany({
      where: (table, { and, eq, or }) =>
        and(
          eq(table.leagueId, input.leagueId),
          or(
            eq(table.requesterId, context.userId),
            eq(table.recipientId, context.userId),
          ),
        ),
      with: {
        requesterCards: {
          with: {},
        },
      },
    });
    return [];
  });

const createTrade = base.trade.create
  .use(memberOfLeague)
  .handler(
    async ({
      input: { leagueId, recipientId, requesterItems, recipientItems },
      context,
    }) => {
      const tradeId = await context.env.db.transaction(async (tx) => {
        const { id: tradeId } = tx
          .insert(tradeRequest)
          .values({ leagueId, requesterId: context.userId, recipientId })
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
