import { eq } from "drizzle-orm";
import type { TX } from "../db";
import { tradeRequest } from "../db/schema";
import { applyCollectionDeltas, deleteCollection } from "./collection";
import { ORPCError } from "@orpc/server";

export function executeTrade(
  tx: TX,
  {
    tradeId,
  }: {
    tradeId: number;
    leagueId: number;
  },
) {
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

  const uniqueCards = new Set([...requesterMap.keys(), ...recipientMap.keys()]);

  // compute deltas
  const requesterDeltas = Array.from(uniqueCards.values()).map((cardName) => ({
    cardName,
    quantity:
      (recipientMap.get(cardName) ?? 0) - (requesterMap.get(cardName) ?? 0),
  }));
  const recipientDeltas = requesterDeltas.map(({ cardName, quantity }) => ({
    cardName,
    quantity: -quantity,
  }));

  applyCollectionDeltas(tx, {
    collectionId: trade.requesterLeagueMembership.collectionId,
    cardDeltas: requesterDeltas,
  });
  applyCollectionDeltas(tx, {
    collectionId: trade.recipientLeagueMembership.collectionId,
    cardDeltas: recipientDeltas,
  });

  // clean up trade request
  deleteTrade(tx, { tradeId });
}

export function deleteTrade(tx: TX, { tradeId }: { tradeId: number }) {
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

  tx.delete(tradeRequest).where(eq(tradeRequest.id, tradeId)).run();
  deleteCollection(tx, { collectionId: trade.requesterCollectionId });
  deleteCollection(tx, { collectionId: trade.recipientCollectionId });
}
