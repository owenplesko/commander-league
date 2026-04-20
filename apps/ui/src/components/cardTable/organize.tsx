import type { Card, CardQuantity } from "@commander-league/contract/schemas";
import type { ReactNode } from "react";

export type CardGroup = {
  groupId: string;
  count: number;
  cardEntries: CardQuantity[];
};

export function organizeCards(
  cardEntries: CardQuantity[],
  {
    groupOption,
    sortOption,
  }: { groupOption: GroupOption; sortOption: SortOption },
): CardGroup[] {
  const cardGroups: Record<string, CardGroup> = {};

  for (const cardEntry of cardEntries.sort(sortOption.compare)) {
    const groupId = groupOption.groupId(cardEntry.card);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = { groupId, count: 0, cardEntries: [] };
    }

    const group = cardGroups[groupId]!;

    group.cardEntries.push(cardEntry);
    group.count += 1;
  }

  return Object.values(cardGroups).sort((a, b) => b.count - a.count);
}

export type GroupOption = {
  label: string;
  groupId: (c: Card) => string;
  header: (id: string) => ReactNode;
};

export const groupOptions: GroupOption[] = [
  {
    label: "Color",
    groupId: (card) => card.data.colorIdentity.join(","),
    header: (groupId) => {
      const colorIdentities = groupId.split(",");
      return (
        <>
          {colorIdentities.map((c) => (
            <img
              width={18}
              height={18}
              src={`https://svgs.scryfall.io/card-symbols/${c || "C"}.svg`}
            />
          ))}
        </>
      );
    },
  },
  {
    label: "Rarity",
    groupId: (c) => c.data.rarity,
    header: (rarity) => rarity,
  },
  {
    label: "Type",
    groupId: (c) => c.data.types.join(","),
    header: (groupId) => {
      const types = groupId.split(",");
      return types.join(" ");
    },
  },
  {
    label: "Subtype",
    groupId: (c) => c.data.subTypes.join(","),
    header: (groupId) => {
      const subTypes = groupId.split(",");
      return subTypes.join(" ") || "N/A";
    },
  },
] as const;

export type SortOption = {
  label: string;
  compare: (a: CardQuantity, b: CardQuantity) => number;
};

export const sortOptions: SortOption[] = [
  { label: "Name", compare: (a, b) => (a.card.name > b.card.name ? 1 : -1) },
  {
    label: "Mana",
    compare: (a, b) => a.card.data.manaValue - b.card.data.manaValue,
  },
] as const;
