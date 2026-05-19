import { InvalidCardsSchema } from "../schemas";

export const invalidCardsError = {
  BAD_REQUEST: {
    data: InvalidCardsSchema,
  },
};
