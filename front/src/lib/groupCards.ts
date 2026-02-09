import type { Card } from "../../../back/src/schemas/card";

export type GroupByOptions = "COLOR";

type CardGroups<T extends Card> = Record<string, { cards: T[] }>;

function getGroupId(card: Card, groupBy: GroupByOptions): string {
  switch (groupBy) {
    case "COLOR":
      return card.data.colorIdentity.join(",");
  }
}

export function groupCards<T extends Card>(
  cards: T[],
  { groupBy }: { groupBy: GroupByOptions },
): CardGroups<T> {
  const cardGroups: CardGroups<T> = {};

  for (const card of cards) {
    const groupId = getGroupId(card, groupBy);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = { cards: [] };
    }

    cardGroups[groupId]?.cards.push(card);
  }

  return cardGroups;
}
