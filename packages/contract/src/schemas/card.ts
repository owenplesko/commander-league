import * as z from "zod";

export const CardPrintingSchema = z.object({
  set: z.string(),
  number: z.string(),
  scryfallId: z.string(),
});
export type CardPrinting = z.infer<typeof CardPrintingSchema>;

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

export const CardSearchParams = z.object({
  cardName: z.string(),
  collectionId: z.number().optional(),
  limit: z.number().optional(),
});
