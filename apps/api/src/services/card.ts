import { inArray } from "drizzle-orm";
import db, { type DB, type QueryClient, type TX } from "../db";
import { card } from "../db/schema";

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
  // no collection scope
  if (!collectionId) {
    const res = qc.query.card
      .findMany({
        where: {
          name: {
            like: `%${cardName}%`,
          },
        },
        limit,
      })
      .sync();

    return res;
  }

  // yes collection scope
  const res = qc.query.collectionCard
    .findMany({
      columns: {},
      where: {
        collectionId,
        cardName: {
          like: `%${cardName}%`,
        },
      },
      limit,
      with: {
        card: true,
      },
    })
    .sync()
    .map(({ card }) => card);

  return res;
}
