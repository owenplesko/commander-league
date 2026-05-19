import z from "zod";
import { CreateCardQuantitySchema, InvalidCardsSchema } from "../schemas";

export const invalidCardsError = {
  BAD_REQUEST: {
    data: InvalidCardsSchema,
  },
};

export const insufficientCardQuantitiesError = {
  CONFLICT: {
    data: z.object({
      insufficientCardQuantities: CreateCardQuantitySchema.array(),
    }),
  },
};
