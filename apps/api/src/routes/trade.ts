import { SQLiteColumn } from "drizzle-orm/sqlite-core";
import {
  collectionCard,
  tradeItemCard,
  tradeSide,
  tradeRequest,
} from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { tradeParticipantGuard } from "../middleware/tradeParticipant";
import { base } from "../orpc";
import { and, count, eq, exists, gte, isNull, lte, ne, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";

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

      // trade execution:
      const [participantA, participantB] = context.participants;

      const { leagueId } = tx
        .select({ leagueId: tradeRequest.leagueId })
        .from(tradeRequest)
        .where(eq(tradeRequest.id, input.tradeId))
        .get()!;

      const targets = tx.$with("targets", {
        targetId: sql<string>`targetId`.as("targetId"),
      }).as(sql`
    SELECT ${participantA} AS targetId
    UNION ALL
    SELECT ${participantB} AS targetId
  `);

      const cardDeltaSubquery = tx
        .with(targets)
        .select({
          userId: targets.targetId,
          leagueId: sql<number>`${leagueId}`.as("leagueId"),
          cardName: tradeItemCard.cardName,
          quantity: sql<number>`
            SUM(
              CASE WHEN ${targets.targetId} = ${tradeItemCard.userId} 
                THEN -${tradeItemCard.quantity}
                ELSE ${tradeItemCard.quantity}
              END
            )`.as("quantity"),
        })
        .from(tradeItemCard)
        .crossJoin(targets)
        .where(eq(tradeItemCard.tradeId, input.tradeId))
        .groupBy(targets.targetId, tradeItemCard.cardName);
      const cardDeltaCTE = cardDeltaSubquery.as("card_delta");

      // apply card delta
      tx.insert(collectionCard)
        .select(cardDeltaSubquery)
        .onConflictDoUpdate({
          target: [
            collectionCard.userId,
            collectionCard.leagueId,
            collectionCard.cardName,
          ],
          set: {
            quantity: sql`${collectionCard.quantity} + EXCLUDED.quantity`,
          },
        })
        .run();

      // remove 0 quantity collection cards affected by trade
      tx.delete(collectionCard)
        .where(
          exists(
            tx
              .select()
              .from(cardDeltaCTE)
              .where(
                and(
                  eq(collectionCard.userId, cardDeltaCTE.userId),
                  eq(collectionCard.cardName, cardDeltaCTE.cardName),
                  eq(collectionCard.quantity, 0),
                ),
              ),
          ),
        )
        .run();

      // clean up trade request
      tx.delete(tradeRequest).where(eq(tradeRequest.id, input.tradeId)).run();
    });
  });

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
};
