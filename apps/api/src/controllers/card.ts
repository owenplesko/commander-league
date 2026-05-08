import { member } from "../middleware/member";
import { searchCards } from "../services";

const listCardsController = member.card.list.handler(({ input }) => {
  return searchCards(input);
});

export const cardRoutes = {
  list: listCardsController,
};
