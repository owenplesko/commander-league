import type { PackOpening } from "@commander-league/contract/schemas";
import * as repo from "../repository";
import { hydrateCardQuantities } from "./card";
import db from "../db";
import { applyCollectionDeltas } from "./collection";

export const listPacks = repo.listPacks;

export const setPackOfferings = repo.setPackOfferings;

export const listPackOfferings = repo.listPackOfferings;

export function filterInvalidPackIds({ packIds }: { packIds: string[] }) {
  const valid = repo.filterExistingPackIds({ packIds });
  const validSet = new Set(valid);

  const invalid = packIds.filter((id) => !validSet.has(id));

  return invalid;
}

export function openPack({
  packId,
  userId,
}: {
  packId: string;
  userId: string;
}): PackOpening {
  const offering = repo.getPackOffering({ packId });
  if (!offering) throw Error(`No pack offering found with id: ${packId}`);

  // 1: select pack structure
  const packStructure = weightedSample(
    offering.pack.structures.map((struct) => ({
      item: struct,
      weight: struct.weight,
    })),
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

  const member = db.transaction((tx) => {
    // 3: get member
    const member = repo.getMember({ userId });
    if (!member) throw new Error(`No user found with id: ${userId}`);

    // 4: validate pp balance
    if (member.packPoints < offering.cost)
      throw new Error("insufficient balance");

    // 5: charge player
    repo.setMemberPackPoints(
      {
        userId,
        packPoints: member.packPoints - offering.cost,
      },
      tx,
    );

    // 6: add cards to collection
    applyCollectionDeltas(
      {
        collectionId: member.collectionId,
        cardDeltas: cardPulls,
      },
      tx,
    );

    return member;
  });

  // 7: build response object
  const cardQuantities = hydrateCardQuantities({ cardQuantities: cardPulls });

  const packOpening: PackOpening = {
    member,
    packOffering: offering,
    contents: cardQuantities,
  };

  return packOpening;
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
