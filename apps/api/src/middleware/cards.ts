import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import { base } from "../orpc";
import * as service from "../services/";
import { ORPCError } from "@orpc/server";

export const invalidCardsMiddleware = base.middleware(
  ({ next }, input: { cardQuantities: CreateCardQuantity[] }) => {
    const invalidCardNames = service.filterInvalidCardNames({
      cardNames: input.cardQuantities.map(({ cardName }) => cardName),
    });

    if (invalidCardNames.length > 0)
      throw new ORPCError("BAD_REQUEST", { data: { invalidCardNames } });

    return next();
  },
);
