import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import db, { type TX } from "../db";
import * as repo from "../repository/collection";
import { withTransaction } from "./util";

export const getCollection = repo.getCollection;

export function setCollectionCards({
  collectionId,
  cardQuantities,
}: {
  collectionId: number;
  cardQuantities: CreateCardQuantity[];
}) {
  db.transaction((tx) => {
    repo.deleteCollectionCards({ collectionId }, tx);
    repo.insertCollectionCards({ collectionId, cardQuantities }, tx);
  });
}

export function applyCollectionDeltas(
  {
    collectionId,
    cardDeltas,
  }: {
    collectionId: number;
    cardDeltas: CreateCardQuantity[];
  },
  tx?: TX,
) {
  withTransaction(tx, (tx) => {
    const existingQuantities = repo.getCollectionCardQuantitiesByName(
      { collectionId, cardNames: cardDeltas.map(({ cardName }) => cardName) },
      tx,
    );

    const quantityMap = new Map<string, number>(
      existingQuantities.map((cq) => [cq.cardName, cq.quantity]),
    );

    const deletions = cardDeltas
      .filter(
        (cd) =>
          quantityMap.has(cd.cardName) &&
          (quantityMap.get(cd.cardName) ?? 0) + cd.quantity === 0,
      )
      .map((cd) => cd.cardName);

    repo.deleteCollectionCardsByName(
      { collectionId, cardNames: deletions },
      tx,
    );

    const upserts = cardDeltas
      .filter((cd) => (quantityMap.get(cd.cardName) ?? 0) + cd.quantity !== 0)
      .map((cd) => ({
        cardName: cd.cardName,
        quantity: (quantityMap.get(cd.cardName) ?? 0) + cd.quantity,
      }));

    repo.upsertCollectionCards({ collectionId, cardQuantities: upserts }, tx);
  });
}
