import { eq } from "drizzle-orm";
import type { QueryClient } from "../db";
import { tradeRequest } from "../db/schema";
import { applyCollectionDeltas, deleteCollection } from "./collection";
import { ORPCError } from "@orpc/server";
import db from "../db";
import { withTransaction } from "../db/helper";

export function executeTrade({
  tradeId,
  qc = db,
}: {
  tradeId: number;
  leagueId: number;
  qc?: QueryClient;
}) {
  withTransaction(qc, (tx) => {
    const trade = tx.query.tradeRequest
      .findFirst({
        where: { id: tradeId },
        with: {
          requesterCardQuantities: true,
          requesterLeagueMembership: true,
          recipientCardQuantities: true,
          recipientLeagueMembership: true,
        },
      })
      .sync();

    if (!trade) throw new ORPCError("INTERNAL_SERVER_ERROR");

    const requesterMap = new Map(
      trade.requesterCardQuantities.map(({ cardName, quantity }) => [
        cardName,
        quantity,
      ]),
    );

    const recipientMap = new Map(
      trade.recipientCardQuantities.map(({ cardName, quantity }) => [
        cardName,
        quantity,
      ]),
    );

    const uniqueCards = new Set([
      ...requesterMap.keys(),
      ...recipientMap.keys(),
    ]);

    // compute deltas
    const requesterDeltas = Array.from(uniqueCards.values()).map(
      (cardName) => ({
        cardName,
        quantity:
          (recipientMap.get(cardName) ?? 0) - (requesterMap.get(cardName) ?? 0),
      }),
    );
    const recipientDeltas = requesterDeltas.map(({ cardName, quantity }) => ({
      cardName,
      quantity: -quantity,
    }));

    applyCollectionDeltas({
      collectionId: trade.requesterLeagueMembership.collectionId,
      cardDeltas: requesterDeltas,
      qc: tx,
    });
    applyCollectionDeltas({
      collectionId: trade.recipientLeagueMembership.collectionId,
      cardDeltas: recipientDeltas,
      qc: tx,
    });

    // clean up trade request
    deleteTrade({ tradeId, qc: tx });
  });
}

export function deleteTrade({
  tradeId,
  qc = db,
}: {
  tradeId: number;
  qc?: QueryClient;
}) {
  withTransaction(qc, (tx) => {
    const trade = tx.query.tradeRequest
      .findFirst({
        columns: { requesterCollectionId: true, recipientCollectionId: true },
        where: { id: tradeId },
      })
      .sync();

    if (!trade) throw new ORPCError("INTERNAL_SERVER_ERROR");

    tx.delete(tradeRequest).where(eq(tradeRequest.id, tradeId)).run();
    deleteCollection({ collectionId: trade.requesterCollectionId, qc: tx });
    deleteCollection({ collectionId: trade.recipientCollectionId, qc: tx });
  });
}
