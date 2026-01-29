import * as z from "zod";

export const CardDataSchema = z.object({
  manaValue: z.number(),
  colorIdentity: z.string().array(),
  printings: z.string().array(),
});
export type CardData = z.infer<typeof CardDataSchema>;

export const CardSchema = z.object({
  name: z.string(),
  data: CardDataSchema,
});
export type Card = z.infer<typeof CardSchema>;

export const CollectionCardSchema = CardSchema.extend({
  quantity: z.number(),
});

export type CollectionCard = z.infer<typeof CollectionCardSchema>;
