import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import type { QueryClient } from "../db";
import { collection, collectionCard } from "../db/schema";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import db from "../db";
import { withTransaction } from "../db/helper";

export function createCollection({ qc = db }: { qc?: QueryClient } = {}) {
  const { collectionId } = qc
    .insert(collection)
    .values({})
    .returning({ collectionId: collection.id })
    .get();

  return { collectionId };
}

export function deleteCollection({
  collectionId,
  qc = db,
}: {
  collectionId: number;
  qc?: QueryClient;
}) {
  qc.delete(collection).where(eq(collection.id, collectionId)).run();
}

export function setCollection({
  collectionId,
  cardQuantities,
  qc = db,
}: {
  collectionId: number;
  cardQuantities: CreateCardQuantity[];
  qc?: QueryClient;
}) {
  if (cardQuantities.length === 0) return;

  withTransaction(qc, (tx) => {
    tx.delete(collectionCard)
      .where(eq(collectionCard.collectionId, collectionId))
      .run();

    tx.insert(collectionCard)
      .values(cardQuantities.map((cq) => ({ collectionId, ...cq })))
      .run();
  });
}

export function applyCollectionDeltas({
  collectionId,
  cardDeltas,
  qc = db,
}: {
  collectionId: number;
  cardDeltas: CreateCardQuantity[];
  qc?: QueryClient;
}) {
  withTransaction(qc, (tx) => {
    const existingQuantities = tx
      .select()
      .from(collectionCard)
      .where(
        and(
          eq(collectionCard.collectionId, collectionId),
          inArray(
            collectionCard.cardName,
            cardDeltas.map((cd) => cd.cardName),
          ),
        ),
      )
      .all();

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

    if (deletions.length > 0) {
      tx.delete(collectionCard)
        .where(
          and(
            eq(collectionCard.collectionId, collectionId),
            inArray(collectionCard.cardName, deletions),
          ),
        )
        .all();
    }

    const upserts = cardDeltas
      .filter((cd) => (quantityMap.get(cd.cardName) ?? 0) + cd.quantity !== 0)
      .map((cd) => ({
        collectionId,
        cardName: cd.cardName,
        quantity: (quantityMap.get(cd.cardName) ?? 0) + cd.quantity,
      }));

    if (upserts.length > 0) {
      tx.insert(collectionCard)
        .values(upserts)
        .onConflictDoUpdate({
          target: [collectionCard.collectionId, collectionCard.cardName],
          set: { quantity: sql`excluded.quantity` },
        })
        .all();
    }
  });
}

export function getMissingCards({
  requiredCollectionId,
  availableCollectionId,
  qc = db,
}: {
  requiredCollectionId: number;
  availableCollectionId: number;
  qc: QueryClient;
}) {
  const required = alias(collectionCard, "required");
  const available = alias(collectionCard, "available");

  const missingQuantity = sql<number>`${required.quantity} - COALESCE(${available.quantity}, 0)`;

  const missingCards = qc
    .select({
      cardName: required.cardName,
      missingQuantity,
    })
    .from(required)
    .leftJoin(
      available,
      and(
        eq(required.cardName, available.cardName),
        eq(available.collectionId, availableCollectionId),
      ),
    )
    .where(
      and(
        eq(required.collectionId, requiredCollectionId),
        gt(missingQuantity, 0),
      ),
    )
    .all();

  return missingCards;
}
