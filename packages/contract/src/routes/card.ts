import { oc } from "@orpc/contract";
import { CardSearchParams } from "../schemas";
import z from "zod";

const searchCards = oc
  .route({
    method: "GET",
    path: "/cards/search",
  })
  .input(CardSearchParams)
  .output(z.string().array());

export const cardRoutes = {
  search: searchCards,
};
