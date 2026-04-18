import { eq } from "drizzle-orm";
import type { QueryClient } from "../db";
import db from "../db";
import { withTransaction } from "../db/helper";
import { deck } from "../db/schema";
import { createCollection, deleteCollection } from "./collection";

export function createDeck({
  userId,
  leagueId,
  name,
  qc = db,
}: {
  userId: string;
  leagueId: number;
  name: string;
  qc?: QueryClient;
}) {
  return withTransaction(qc, (tx) => {
    const { collectionId } = createCollection({ qc: tx });

    const { deckId } = tx
      .insert(deck)
      .values({ userId, leagueId, name, collectionId })
      .returning({ deckId: deck.id })
      .get();

    return deckId;
  });
}

export function getDeck({
  deckId,
  qc = db,
}: {
  deckId: number;
  qc?: QueryClient;
}) {
  const res = qc.query.deck
    .findFirst({
      where: { id: deckId },
      with: { owner: true, cardQuantities: { with: { card: true } } },
    })
    .sync()!;

  return res;
}

export function getDeckCollectionId({
  deckId,
  qc = db,
}: {
  deckId: number;
  qc?: QueryClient;
}) {
  const collectionId = qc
    .select({ collectionId: deck.collectionId })
    .from(deck)
    .where(eq(deck.id, deckId))
    .get()?.collectionId;

  return collectionId;
}
