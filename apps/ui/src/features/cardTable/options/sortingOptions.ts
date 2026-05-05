import type { CardSortingMethods, SortOption } from "../types/cardSorting";

export const sortByName: CardSortingMethods = {
  compare: (a, b) => (a.card.name > b.card.name ? 1 : -1),
};

export const sortByMana: CardSortingMethods = {
  compare: (a, b) => b.card.data.manaValue - a.card.data.manaValue,
};

export const sortingOptions: SortOption[] = [
  { label: "Name", methods: sortByName },
  { label: "Mana", methods: sortByMana },
];
