import * as z from "zod";

export const CardPrintingSchema = z.object({
  set: z.string(),
  number: z.string(),
  scryfallId: z.string(),
});
export type CarPrinting = z.infer<typeof CardPrintingSchema>;

export const CardDataSchema = z.object({
  manaValue: z.number(),
  colorIdentity: z.string().array(),
  rarity: z.string(),
  types: z.string().array(),
  subTypes: z.string().array(),
  printings: CardPrintingSchema.array(),
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
