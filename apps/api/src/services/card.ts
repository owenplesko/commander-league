import { inArray } from "drizzle-orm";
import db, { type DB, type TX } from "../db";
import { card } from "../db/schema";
import * as repo from "../repository/";

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
  searchTerm = "",
  collectionId,
  limit = 10,
}: {
  searchTerm?: string;
  collectionId?: number;
  limit?: number;
}) {
  if (collectionId)
    return repo.collectionCardSearch({ searchTerm, collectionId, limit });

  return repo.globalCardSearch({ searchTerm, limit });
}

export function filterInvalidCardNames({ cardNames }: { cardNames: string[] }) {
  const validCards = repo.filterValidCardNames({ cardNames });

  const validNames = new Set(validCards.map((c) => c.name));

  const invalidNames = cardNames.filter((name) => !validNames.has(name));

  return invalidNames;
}
