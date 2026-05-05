import type { CardQuantity } from "@commander-league/contract/schemas";
import type { ReactNode } from "react";

export type CardGroup = {
  id: string;
  header: () => ReactNode;
  entries: CardQuantity[];
};

export type GroupOption = {
  label: string;
  methods: GroupingMethods<any>;
};

export type GroupingMethods<T> = {
  dataAccessor: (cardQuantity: CardQuantity) => T;
  idAccessor: (data: T) => string;
  headerTemplate: (data: T) => ReactNode;
};
