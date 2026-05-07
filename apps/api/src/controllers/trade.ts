import { tradeRequest } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import {
  tradeParticipantGuard,
  tradeRequesterGuard,
} from "../middleware/trade";
import { public } from "../orpc";
import { and, eq, or } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import {
  executeTrade,
  deleteTrade as deleteTradeProcedure,
} from "../services/trade";
import { createCollection, setCollectionCards } from "../services/collection";

const listTradesController = public.trade.list
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

const createTradeController = public.trade.create
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
        const { collectionId: requesterCollectionId } = createCollection({
          qc: tx,
        });
        setCollectionCards({
          collectionId: requesterCollectionId,
          cardQuantities: offerCardQuantities,
        });

        const { collectionId: recipientCollectionId } = createCollection({
          qc: tx,
        });
        setCollectionCards({
          collectionId: recipientCollectionId,
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

const setTradeStatusController = public.trade.setStatus
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
        executeTrade({
          tradeId: input.tradeId,
          leagueId: input.leagueId,
          qc: tx,
        });
    });
  });

const deleteTradeController = public.trade.delete
  .use(tradeRequesterGuard)
  .handler(async ({ input }) => {
    deleteTradeProcedure({ tradeId: input.tradeId });
  });

export const tradeRoutes = {
  list: listTradesController,
  create: createTradeController,
  setStatus: setTradeStatusController,
  delete: deleteTradeController,
};
