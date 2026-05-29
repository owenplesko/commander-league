import z from "zod";
import { CreateCardQuantitySchema, CardnameResolutionSchema } from "../schemas";

export const cardResolutionError = {
  BAD_REQUEST: {
    data: CardnameResolutionSchema,
  },
};

export const insufficientCardQuantitiesError = {
  CONFLICT: {
    data: z.object({
      insufficientCardQuantities: CreateCardQuantitySchema.array(),
    }),
  },
};
