import type { CardQuantity } from "@commander-league/contract/schemas";
import * as repo from "../repository";
import { hydrateCardQuantities } from "./card";

export const listPacks = repo.listPacks;

export const setPackOfferings = repo.setPackOfferings;

export const listPackOfferings = repo.listPackOfferings;

export function filterInvalidPackIds({ packIds }: { packIds: string[] }) {
  const valid = repo.filterExistingPackIds({ packIds });
  const validSet = new Set(valid);

  const invalid = packIds.filter((id) => !validSet.has(id));

  return invalid;
}

export function openPack({ packId }: { packId: string }): CardQuantity[] {
  const pack = repo.getPack({ packId });
  if (!pack) throw Error(`No pack found with id: ${packId}`);

  // 1: select pack structure
  const packStructure = weightedSample(
    pack.structures.map((struct) => ({ item: struct, weight: struct.weight })),
  );

  // 2: select cards from card pool for each slot
  const cardPullMap = new Map<string, number>();

  for (const slot of packStructure.slots) {
    for (let i = 0; i < slot.count; i++) {
      const card = weightedSample(
        slot.cardPool.cardQuantities.map(({ cardName, quantity }) => ({
          item: cardName,
          weight: quantity,
        })),
      );

      const count = cardPullMap.get(card) ?? 0;
      cardPullMap.set(card, count + 1);
    }
  }

  const cardPulls = cardPullMap
    .entries()
    .toArray()
    .map(([cardName, quantity]) => ({ cardName, quantity }));

  // 3: hydrate card data
  return hydrateCardQuantities({ cardQuantities: cardPulls });
}

function weightedSample<T>(input: { item: T; weight: number }[]) {
  const totalWeight = input.reduce((sum, { weight }) => sum + weight, 0);

  let threshold = Math.random() * totalWeight;

  for (const { item, weight } of input) {
    threshold -= weight;
    if (threshold <= 0) {
      return item;
    }
  }

  throw new Error(
    `Weighted sampling loop terminated unexpectedly. Remaining threshold: ${threshold}`,
  );
}
