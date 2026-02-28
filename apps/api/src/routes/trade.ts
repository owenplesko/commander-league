import { tradeItemCard, tradeItems, tradeRequest } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";

const listTrades = base.trade.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const trades = await context.env.db.query.tradeRequest.findMany({
      where: {
        leagueId: input.leagueId,
        OR: [{ requesterId: context.userId }, { recipientId: context.userId }],
      },
      with: {
        requester: true,
        requesterItems: {
          with: {
            cards: {
              with: {
                card: true,
              },
            },
          },
        },
        recipient: true,
        recipientItems: {
          with: {
            cards: {
              with: {
                card: true,
              },
            },
          },
        },
      },
    });

    return trades;
  });

const createTrade = base.trade.create
  .use(memberOfLeague)
  .handler(
    ({
      input: { leagueId, recipientId, requesterItems, recipientItems },
      context,
    }) => {
      const tradeId = context.env.db.transaction((tx) => {
        const { tradeId } = tx
          .insert(tradeRequest)
          .values({ leagueId, requesterId: context.userId, recipientId })
          .returning({ tradeId: tradeRequest.id })
          .get();

        const { requesterItemsId } = tx
          .insert(tradeItems)
          .values([{ tradeId, role: "requester" }])
          .returning({ requesterItemsId: tradeItems.id })
          .get();

        const { recipientItemsId } = tx
          .insert(tradeItems)
          .values([{ tradeId, role: "recipient" }])
          .returning({ recipientItemsId: tradeItems.id })
          .get();

        tx.insert(tradeItemCard)
          .values([
            ...requesterItems.cards.map((tradeCard) => ({
              tradeItemId: requesterItemsId,
              ...tradeCard,
            })),
            ...recipientItems.cards.map((tradeCard) => ({
              tradeItemId: recipientItemsId,
              ...tradeCard,
            })),
          ])
          .run();

        return tradeId;
      });

      return { tradeId };
    },
  );

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
};
