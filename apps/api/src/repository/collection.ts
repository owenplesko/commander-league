import { and, eq, gt, inArray, sql } from "drizzle-orm";
import db, { type DB, type TX } from "../db";
import { collection, collectionCard } from "../db/schema";
import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import { alias } from "drizzle-orm/sqlite-core";

export function getCollection({ collectionId }: { collectionId: number }) {
  const res = db.query.collection
    .findFirst({
      where: {
        id: collectionId,
      },
      with: { cardQuantities: { with: { card: true } } },
    })
    .sync();

  return res;
}

export function insertCollection(tx: TX) {
  const res = tx.insert(collection).values({}).returning().get();
  return res;
}

export function deleteCollection(
  { collectionId }: { collectionId: number },
  tx: TX,
) {
  tx.delete(collection).where(eq(collection.id, collectionId)).run();
}

export const deleteCollectionCards = (
  { collectionId }: { collectionId: number },
  tx: TX,
) => {
  return tx
    .delete(collectionCard)
    .where(eq(collectionCard.collectionId, collectionId))
    .run();
};

export function insertCollectionCards(
  {
    collectionId,
    cardQuantities,
  }: { collectionId: number; cardQuantities: CreateCardQuantity[] },
  tx: TX,
) {
  if (cardQuantities.length > 0)
    tx.insert(collectionCard)
      .values(cardQuantities.map((cq) => ({ collectionId, ...cq })))
      .run();
}

export function getCollectionCardQuantitiesByName(
  {
    collectionId,
    cardNames,
  }: {
    collectionId: number;
    cardNames: string[];
  },
  tx: TX,
) {
  if (cardNames.length === 0) return [];

  const res = tx
    .select({
      cardName: collectionCard.cardName,
      quantity: collectionCard.quantity,
    })
    .from(collectionCard)
    .where(
      and(
        eq(collectionCard.collectionId, collectionId),
        inArray(collectionCard.cardName, cardNames),
      ),
    )
    .all();
  return res;
}

export function getInsufficientCardQuantities(
  {
    requiredCollectionId,
    availableCollectionId,
  }: {
    requiredCollectionId: number;
    availableCollectionId: number;
  },
  tx: TX | DB = db,
) {
  const required = alias(collectionCard, "required");
  const available = alias(collectionCard, "available");
  const insufficientQuantity = sql<number>`${required.quantity} - COALESCE(${available.quantity}, 0)`;

  const insufficientCardQuantities = tx
    .select({
      cardName: required.cardName,
      quantity: insufficientQuantity,
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
        gt(insufficientQuantity, 0),
      ),
    )
    .all();

  return insufficientCardQuantities;
}

export function getCollectionCardQuantities(
  { collectionId }: { collectionId: number },
  tx: TX,
) {
  return tx.query.collectionCard
    .findMany({
      columns: { cardName: true, quantity: true },
      where: { collectionId },
    })
    .sync();
}

export function deleteCollectionCardsByName(
  {
    collectionId,
    cardNames,
  }: {
    collectionId: number;
    cardNames: string[];
  },
  tx: TX,
) {
  tx.delete(collectionCard)
    .where(
      and(
        eq(collectionCard.collectionId, collectionId),
        inArray(collectionCard.cardName, cardNames),
      ),
    )
    .all();
}

export function upsertCollectionCards(
  {
    collectionId,
    cardQuantities,
  }: {
    collectionId: number;
    cardQuantities: CreateCardQuantity[];
  },
  tx: TX,
) {
  if (cardQuantities.length === 0) return;

  tx.insert(collectionCard)
    .values(cardQuantities.map((cq) => ({ collectionId, ...cq })))
    .onConflictDoUpdate({
      target: [collectionCard.collectionId, collectionCard.cardName],
      set: { quantity: sql`excluded.quantity` },
    })
    .all();
}
