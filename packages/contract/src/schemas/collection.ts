import z from "zod";
import { CardSchema } from "./card";

export const CollectionCardSchema = z.object({
  quantity: z.number(),
  card: CardSchema,
});

export type CollectionCard = z.infer<typeof CollectionCardSchema>;

export const CollectionSchema = z.object({
  cards: CollectionCardSchema.array(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = z.object({
  cards: z
    .object({ cardName: CardSchema.shape.name, quantity: z.number() })
    .array(),
});
