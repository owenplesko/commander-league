import type { CardQuantity } from "@commander-league/contract/schemas";

export type CardSortingMethods = {
  compare: (a: CardQuantity, b: CardQuantity) => number;
};

export type SortOption = {
  label: string;
  methods: CardSortingMethods;
};
