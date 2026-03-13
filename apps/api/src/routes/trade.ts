import { tradeItemCard, tradeSide, tradeRequest } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { tradeParticipantGuard } from "../middleware/tradeParticipant";
import { base } from "../orpc";
import { and, count, eq, ne } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { executeTrade } from "../procedures/trade";

const listTrades = base.trade.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const trades = context.env.db.transaction((tx) => {
      // get relevant trade ids
      const tradeIds = tx
        .select({ id: tradeSide.tradeId })
        .from(tradeSide)
        .innerJoin(tradeRequest, eq(tradeRequest.id, tradeSide.tradeId))
        .where(
          and(
            eq(tradeRequest.leagueId, input.leagueId),
            eq(tradeSide.userId, context.userId),
          ),
        )
        .all()
        .map(({ id }) => id);

      // query trades
      const trades = tx.query.tradeRequest
        .findMany({
          where: {
            id: { in: tradeIds },
          },
          with: {
            sides: {
              with: {
                cards: {
                  with: { card: true },
                },
                user: true,
              },
            },
          },
        })
        .sync();

      return trades;
    });

    return trades;
  });

const createTrade = base.trade.create
  .use(memberOfLeague)
  .handler(({ input: { leagueId, sides }, context }) => {
    const trade = context.env.db.transaction((tx) => {
      // insert trade request
      const { tradeId } = tx
        .insert(tradeRequest)
        .values({ leagueId, ownerId: context.userId })
        .returning({ tradeId: tradeRequest.id })
        .get();

      // insert trade sides
      tx.insert(tradeSide)
        .values(sides.map(({ userId }) => ({ userId, tradeId })))
        .run();

      // insert trade cards
      tx.insert(tradeItemCard)
        .values(
          sides.flatMap(({ userId, cards }) =>
            cards.map(({ cardName, quantity }) => ({
              tradeId,
              userId,
              cardName,
              quantity,
            })),
          ),
        )
        .run();

      // retrieve trade response
      const trade = tx.query.tradeRequest
        .findFirst({
          where: {
            id: tradeId,
          },
          with: {
            sides: {
              with: {
                cards: {
                  with: { card: true },
                },
                user: true,
              },
            },
          },
        })
        .sync();

      return trade;
    });

    if (!trade) throw new ORPCError("CONFLICT");

    return trade;
  });

const setTradeStatus = base.trade.setStatus
  .use(tradeParticipantGuard)
  .handler(({ input, context }) => {
    context.env.db.transaction((tx) => {
      // update trade status
      tx.update(tradeSide)
        .set({ status: input.status })
        .where(
          and(
            eq(tradeSide.tradeId, input.tradeId),
            eq(tradeSide.userId, context.userId),
          ),
        )
        .run();

      // trade status guard clause for trade execution
      const { unacceptedCount } = tx
        .select({ unacceptedCount: count() })
        .from(tradeSide)
        .where(
          and(
            eq(tradeSide.tradeId, input.tradeId),
            ne(tradeSide.status, "accepted"),
          ),
        )
        .get()!;

      if (unacceptedCount > 0) return;

      executeTrade(tx, { tradeId: input.tradeId, leagueId: input.leagueId });
    });
  });

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
};
