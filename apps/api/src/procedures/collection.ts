import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import type { TX } from "../db";
import { collection, collectionCard } from "../db/schema";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

export function createCollection(
  tx: TX,
  params?: { cardQuantities?: CreateCardQuantity[] },
) {
  const { collectionId } = tx
    .insert(collection)
    .values({})
    .returning({ collectionId: collection.id })
    .get();

  if (params?.cardQuantities)
    setCollection(tx, { collectionId, cardQuantities: params.cardQuantities });

  return { collectionId };
}

export function getCollection(
  tx: TX,
  { collectionId }: { collectionId: number },
) {
  return tx.query.collection
    .findFirst({
      where: { id: collectionId },
      with: { cardQuantities: true },
    })
    .sync();
}

export function deleteCollection(
  tx: TX,
  { collectionId }: { collectionId: number },
) {
  tx.delete(collection).where(eq(collection.id, collectionId)).run();
}

export function setCollection(
  tx: TX,
  {
    collectionId,
    cardQuantities,
  }: { collectionId: number; cardQuantities: CreateCardQuantity[] },
) {
  if (cardQuantities.length === 0) return;

  tx.delete(collectionCard)
    .where(eq(collectionCard.collectionId, collectionId))
    .run();

  tx.insert(collectionCard)
    .values(cardQuantities.map((cq) => ({ collectionId, ...cq })))
    .run();
}

export function applyCollectionDeltas(
  tx: TX,
  {
    collectionId,
    cardDeltas,
  }: { collectionId: number; cardDeltas: CreateCardQuantity[] },
) {
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
}

export function getMissingCards(
  tx: TX,
  {
    requiredCollectionId,
    availableCollectionId,
  }: { requiredCollectionId: number; availableCollectionId: number },
) {
  const required = alias(collectionCard, "required");
  const available = alias(collectionCard, "available");

  const missingQuantity = sql<number>`${required.quantity} - COALESCE(${available.quantity}, 0)`;

  const missingCards = tx
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
