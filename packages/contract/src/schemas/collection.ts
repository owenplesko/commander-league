import z from "zod";
import { CardSchema } from "./card";

export const CollectionCardSchema = CardSchema.extend({
  quantity: z.number(),
});

export type CollectionCard = z.infer<typeof CollectionCardSchema>;

export const CollectionSchema = z.object({
  cards: CollectionCardSchema.array(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = z.object({
  cards: CollectionCardSchema.pick({ name: true, quantity: true }).array(),
});
