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

export function resolveCardAliases({ cardNames }: { cardNames: string[] }) {
  const rows = repo.resolveCardNames({ cardNames });

  const map = new Map<
    string,
    { input: string; cardName: string | null; aliasedCardNames: string[] }
  >();
  for (const { input, cardName, aliasedCardName } of rows) {
    if (!map.has(input))
      map.set(input, { input, cardName, aliasedCardNames: [] });
    if (aliasedCardName) map.get(input)!.aliasedCardNames.push(aliasedCardName);
  }

  const unknown: string[] = [];
  const ambiguous: { alias: string; cardNames: string[] }[] = [];
  const resolvedCardNames: string[] = [];

  for (const { input, cardName, aliasedCardNames } of map.values()) {
    if (cardName !== null) {
      resolvedCardNames.push(cardName);
    } else if (aliasedCardNames.length === 1) {
      resolvedCardNames.push(aliasedCardNames[0]!);
    } else if (aliasedCardNames.length === 0) {
      unknown.push(input);
    } else {
      ambiguous.push({ alias: input, cardNames: aliasedCardNames });
    }
  }

  if (unknown.length > 0 || ambiguous.length > 0) {
    return { success: false, unknown, ambiguous };
  }
  return { success: true, cardNames: resolvedCardNames };
}

// TODO: remove
export function filterInvalidCardNames({ cardNames }: { cardNames: string[] }) {
  const validCards = repo.filterValidCardNames({ cardNames });

  const validNames = new Set(validCards.map((c) => c.name));

  const invalidNames = cardNames.filter((name) => !validNames.has(name));

  return invalidNames;
}
