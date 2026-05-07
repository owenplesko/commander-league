import { member } from "../orpc";
import { searchCards } from "../services/card";

const listCardsController = member.card.list.handler(({ input }) => {
  return searchCards(input);
});

export const cardRoutes = {
  list: listCardsController,
};
