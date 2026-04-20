import { inArray, like, and, eq } from "drizzle-orm";
import db, { type DB, type QueryClient, type TX } from "../db";
import { card, collectionCard } from "../db/schema";

export function getInvalidCardNames({
  qc = db,
  cardNames,
}: {
  qc?: DB | TX;
  cardNames: string[];
}) {
  if (cardNames.length === 0) return [];

  const validCards = qc
    .select({ name: card.name })
    .from(card)
    .where(inArray(card.name, cardNames))
    .all();

  const validNames = new Set(validCards.map((c) => c.name));

  const invalidNames = cardNames.filter((name) => !validNames.has(name));

  return invalidNames;
}

export function searchCards({
  qc = db,
  cardName,
  collectionId,
  limit = 10,
}: {
  qc?: QueryClient;
  cardName: string;
  collectionId?: number;
  limit?: number;
}) {
  let query = (
    collectionId
      ? qc
          .select({ cardName: card.name })
          .from(collectionCard)
          .where(
            and(
              eq(collectionCard.collectionId, collectionId),
              like(card.name, cardName),
            ),
          )
      : qc
          .select({ cardName: card.name })
          .from(card)
          .where(like(card.name, cardName))
  ).limit(limit);

  return query.all().map(({ cardName }) => cardName);
}
