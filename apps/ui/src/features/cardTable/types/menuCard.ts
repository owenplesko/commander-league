import type { CardQuantity } from "@commander-league/contract/schemas";

export type MenuCard = CardQuantity & {
  groupId: string;
};
