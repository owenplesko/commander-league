import { oc } from "@orpc/contract";
import { CardSchema, CardSearchParams } from "../schemas";

const searchCards = oc
  .route({
    method: "GET",
    path: "/cards/search",
  })
  .input(CardSearchParams)
  .output(CardSchema.array());

export const cardRoutes = {
  search: searchCards,
};
