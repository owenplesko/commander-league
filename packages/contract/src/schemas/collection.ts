import z from "zod";
import { CardSchema } from "./card";

export const CardQuantitySchema = z.object({
  quantity: z.number(),
  card: CardSchema,
});
export type CardQuantity = z.infer<typeof CardQuantitySchema>;

export const CollectionSchema = z.object({
  cardQuantities: CardQuantitySchema.array(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCardQuantitySchema = z.object({
  quantity: z.number(),
  cardName: z.string(),
});
export type CreateCardQuantity = z.infer<typeof CreateCardQuantitySchema>;

export const CreateCollectionBodySchema = z.object({
  cardQuantites: CreateCardQuantitySchema.array(),
});
