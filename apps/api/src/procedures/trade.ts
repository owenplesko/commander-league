import { eq } from "drizzle-orm";
import type { TX } from "../db";
import { tradeSide, tradeRequest } from "../db/schema";
import {
  applyCollectionDeltas,
  deleteCollection,
  getCollection,
} from "./collection";
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
  const [sideA, sideB] = tx
    .select()
    .from(tradeSide)
    .where(eq(tradeSide.tradeId, tradeId))
    .all();

  if (!sideA || !sideB) throw new ORPCError("INTERNAL_SERVER_ERROR");

  const A = getCollection(tx, { collectionId: sideA.collectionId });
  const B = getCollection(tx, { collectionId: sideB.collectionId });

  if (!A || !B) throw new ORPCError("INTERNAL_SERVER_ERROR");

  const Amap = new Map(
    A.cardQuantities.map(({ cardName, quantity }) => [cardName, quantity]),
  );
  const Bmap = new Map(
    B.cardQuantities.map(({ cardName, quantity }) => [cardName, quantity]),
  );

  const uniqueCards = new Set([...Amap.keys(), ...Bmap.keys()]);

  // compute deltas
  const deltasA = Array.from(uniqueCards.values()).map((cardName) => ({
    cardName,
    quantity: (Bmap.get(cardName) ?? 0) - (Amap.get(cardName) ?? 0),
  }));
  const deltasB = deltasA.map(({ cardName, quantity }) => ({
    cardName,
    quantity: -quantity,
  }));

  applyCollectionDeltas(tx, {
    collectionId: sideA.collectionId,
    cardDeltas: deltasA,
  });
  applyCollectionDeltas(tx, {
    collectionId: sideB.collectionId,
    cardDeltas: deltasB,
  });

  // clean up trade request
  tx.delete(tradeRequest).where(eq(tradeRequest.id, tradeId)).run();
  deleteCollection(tx, { collectionId: sideA.collectionId });
  deleteCollection(tx, { collectionId: sideB.collectionId });
}
