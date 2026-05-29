import { inArray } from "drizzle-orm";
import db, { type DB, type TX } from "../db";
import { card } from "../db/schema";
import * as repo from "../repository/";
import type { CreateCardQuantity } from "@commander-league/contract/schemas";

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

  const unknown: { cardName: string }[] = [];
  const ambiguous: { cardName: string; resolutions: string[] }[] = [];
  const resolutions: { cardName: string; resolution: string }[] = [];

  for (const { input, cardName, aliasedCardNames } of map.values()) {
    if (cardName !== null) {
      resolutions.push({ cardName: input, resolution: cardName });
    } else if (aliasedCardNames.length === 1) {
      resolutions.push({ cardName: input, resolution: aliasedCardNames[0]! });
    } else if (aliasedCardNames.length === 0) {
      unknown.push({ cardName: input });
    } else {
      ambiguous.push({ cardName: input, resolutions: aliasedCardNames });
    }
  }

  return {
    unknown: unknown.length > 0 ? unknown : null,
    ambiguous: ambiguous.length > 0 ? ambiguous : null,
    resolutions,
  };
}

export function resolveCardQuantityAliases({
  cardQuantities,
}: {
  cardQuantities: CreateCardQuantity[];
}) {
  const res = resolveCardAliases({
    cardNames: cardQuantities.map(({ cardName }) => cardName),
  });

  const quantityMap = new Map(
    cardQuantities.map(({ cardName, quantity }) => [cardName, quantity]),
  );

  const resolutions = {
    ...res,
    resolutions: res.resolutions.map(({ cardName, resolution }) => ({
      cardName: resolution,
      quantity: quantityMap.get(cardName)!,
    })),
  };

  return resolutions;
}
