import z from "zod";
import { CardQuantitySchema, CreateCardQuantitySchema } from "./card";

export const CollectionSchema = z.object({
  cards: CardQuantitySchema.array(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionBodySchema = z.object({
  cards: CreateCardQuantitySchema.array(),
});
