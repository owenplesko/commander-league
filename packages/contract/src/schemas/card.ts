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

export const CardListParams = z.object({
  searchTerm: z.string(),
  collectionId: z.coerce.number<number>().optional(),
  limit: z.coerce.number<number>().min(1).max(100).optional(),
});

export const CardnameResolutionSchema = z.object({
  unknown: z.object({ cardName: z.string() }).array().nullable(),
  ambiguous: z
    .object({ cardName: z.string(), resolutions: z.string().array() })
    .array()
    .nullable(),
});
export type CardResolution = z.infer<typeof CardnameResolutionSchema>;
