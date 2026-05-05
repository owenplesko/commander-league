import type { CardQuantity } from "@commander-league/contract/schemas";
import type { CardGroup, GroupingMethods } from "../types/cardGrouping";
import type { CardSortingMethods } from "../types/cardSorting";

export function useCardGrouping<T>({
  cardQuantities,
  groupMethods: { dataAccessor, idAccessor, headerTemplate },
  premadeGroups = [],
  sortBy,
}: {
  cardQuantities: CardQuantity[];
  groupMethods: GroupingMethods<T>;
  premadeGroups?: CardGroup[];
  sortBy?: CardSortingMethods;
}): CardGroup[] {
  const groups = new Map<string, CardGroup>();

  for (const cardQuantity of cardQuantities) {
    const data = dataAccessor(cardQuantity);
    const id = idAccessor(data);

    if (!groups.has(id)) {
      groups.set(id, { id, header: () => headerTemplate(data), entries: [] });
    }

    groups.get(id)!.entries.push(cardQuantity);
  }

  const groupsArr = [
    ...premadeGroups,
    ...Array.from(groups.values()).toSorted(
      (a, b) => b.entries.length - a.entries.length,
    ),
  ];

  if (sortBy) for (const { entries } of groupsArr) entries.sort(sortBy.compare);

  return groupsArr;
}
