import { oc } from "@orpc/contract";
import { CardSchema, CardListParams } from "../schemas";

const listCards = oc
  .route({
    method: "GET",
    path: "/card",
  })
  .input(CardListParams)
  .output(CardSchema.array());

export const cardRoutes = {
  list: listCards,
};
