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
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
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
            neq(tradeSide.status, "accepted"),
          ),
        )
        .get()!;

      if (unacceptedCount > 0) return;

      // trade cards guard clause for trade execution
      const { missingCardCount } = tx
        .select({ missingCardCount: count() })
        .from(tradeRequest)
        .innerJoin(tradeSide, eq(tradeRequest.id, tradeSide.tradeId))
        .innerJoin(
          tradeItemCard,
          and(
            eq(tradeItemCard.tradeId, tradeSide.tradeId),
            eq(tradeItemCard.userId, tradeSide.userId),
          ),
        )
        .leftJoin(
          collectionCard,
          and(
            eq(collectionCard.leagueId, tradeRequest.leagueId),
            eq(collectionCard.userId, tradeItemCard.userId),
            eq(collectionCard.cardName, tradeItemCard.cardName),
            gte(collectionCard.quantity, tradeItemCard.quantity),
          ),
        )
        .get()!;

      if (missingCardCount > 0)
        throw new ORPCError("CONFLICT", {
          message:
            "one or more participants do not have all required trade items",
        });

      // execute trade

      // remove trade cards from collections
      const tradeCards = tx
        .select()
        .from(tradeRequest)
        .innerJoin(tradeItemCard, eq(tradeItemCard.tradeId, tradeRequest.id))
        .where(eq(tradeRequest.id, input.tradeId))
        .as("trade_cards");

      tx.update(collectionCard)
        .set({
          quantity: sql`${collectionCard.quantity} - ${tradeCards.trade_item_card.quantity}`,
        })
        .from(tradeCards)
        .where(
          and(
            eq(collectionCard.leagueId, tradeCards.trade_request.leagueId),
            eq(collectionCard.userId, tradeCards.trade_item_card.userId),
            eq(collectionCard.cardName, tradeCards.trade_item_card.cardName),
          ),
        )
        .run();

      // clean up collection cards with quantity 0
      tx.delete(collectionCard).where(lte(collectionCard.quantity, 0)).run();

      // clean up trade request
      tx.delete(tradeRequest).where(eq(tradeRequest.id, input.tradeId)).run();
    });
  });

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
};
function neq(
  status: SQLiteColumn<
    {
      name: string;
      tableName: "trade_side";
      dataType: "string enum";
      data: "accepted" | "pending" | "rejected";
      driverParam: string;
      notNull: true;
      hasDefault: true;
      isPrimaryKey: false;
      isAutoincrement: false;
      hasRuntimeDefault: false;
      enumValues: ["accepted", "pending", "rejected"];
      baseColumn: never;
      identity: undefined;
      generated: undefined;
    },
    {}
  >,
  arg1: string,
): import("drizzle-orm").SQLWrapper<unknown> | undefined {
  throw new Error("Function not implemented.");
}
