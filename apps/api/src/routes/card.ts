import { base } from "../orpc";
import { searchCards } from "../services/card";

const searchCardsController = base.card.search.handler(({ input, context }) => {
  const res = searchCards({ ...input });
  return res;
});

export const cardRoutes = {
  search: searchCardsController,
};
