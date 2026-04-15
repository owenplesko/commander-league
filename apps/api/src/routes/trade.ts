import { tradeRequest } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import {
  tradeParticipantGuard,
  tradeRequesterGuard,
} from "../middleware/trade";
import { base } from "../orpc";
import { and, eq, or } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import {
  executeTrade,
  deleteTrade as deleteTradeProcedure,
} from "../services/trade";
import { createCollection } from "../services/collection";

const listTradesController = base.trade.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const trades = context.env.db.transaction((tx) => {
      // get relevant trade ids
      const tradeIds = tx
        .select({ id: tradeRequest.id })
        .from(tradeRequest)
        .where(
          and(
            eq(tradeRequest.leagueId, input.leagueId),
            or(
              eq(tradeRequest.requesterId, context.userId),
              eq(tradeRequest.recipientId, context.userId),
            ),
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
            requester: true,
            requesterCardQuantities: {
              with: { card: true },
            },
            recipient: true,
            recipientCardQuantities: {
              with: { card: true },
            },
          },
        })
        .sync();

      return trades;
    });

    return trades;
  });

const createTradeController = base.trade.create
  .use(memberOfLeague)
  .handler(
    ({
      input: {
        leagueId,
        recipientId,
        offerCardQuantities,
        recipientCardQuantities,
      },
      context,
    }) => {
      const trade = context.env.db.transaction((tx) => {
        const { collectionId: requesterCollectionId } = createCollection(tx, {
          cardQuantities: offerCardQuantities,
        });
        const { collectionId: recipientCollectionId } = createCollection(tx, {
          cardQuantities: recipientCardQuantities,
        });

        // insert trade request
        const { tradeId } = tx
          .insert(tradeRequest)
          .values({
            leagueId,
            requesterId: context.userId,
            requesterCollectionId,
            recipientId,
            recipientCollectionId,
          })
          .returning({ tradeId: tradeRequest.id })
          .get();

        // retrieve trade response
        const trade = tx.query.tradeRequest
          .findFirst({
            where: {
              id: tradeId,
            },
            with: {
              requester: true,
              requesterCardQuantities: {
                with: { card: true },
              },
              recipient: true,
              recipientCardQuantities: {
                with: { card: true },
              },
            },
          })
          .sync();

        return trade;
      });

      if (!trade) throw new ORPCError("CONFLICT");

      return trade;
    },
  );

const setTradeStatusController = base.trade.setStatus
  .use(tradeParticipantGuard)
  .handler(({ input, context }) => {
    context.env.db.transaction((tx) => {
      // update trade status
      tx.update(tradeRequest)
        .set(
          context.tradeRole === "requester"
            ? { requesterStatus: input.status }
            : { recipientStatus: input.status },
        )
        .where(eq(tradeRequest.id, input.tradeId))
        .run();

      const trade = tx.query.tradeRequest
        .findFirst({
          where: { id: input.tradeId },
        })
        .sync()!;

      if (
        trade.requesterStatus === "accepted" &&
        trade.recipientStatus === "accepted"
      )
        executeTrade(tx, { tradeId: input.tradeId, leagueId: input.leagueId });
    });
  });

const deleteTradeController = base.trade.delete
  .use(tradeRequesterGuard)
  .handler(async ({ input, context }) => {
    context.env.db.transaction((tx) => {
      deleteTradeProcedure(tx, { tradeId: input.tradeId });
    });
  });

export const tradeRoutes = {
  list: listTradesController,
  create: createTradeController,
  setStatus: setTradeStatusController,
  delete: deleteTradeController,
};
