import z from "zod";
import { UserSchema } from "./user";
import { CardSchema } from "./card";
import { CardQuantitySchema, CreateCardQuantitySchema } from "./collection";

export const DeckListEntrySchema = z.object({
  id: z.number(),
  commanderCard: CardSchema,
  name: z.string(),
});
export type DeckListEntry = z.infer<typeof DeckListEntrySchema>;

export const DeckSchema = DeckListEntrySchema.extend({
  id: z.number(),
  name: z.string(),
  owner: UserSchema,
  cardQuantities: CardQuantitySchema.array(),
  commanderCard: CardSchema,
  partnerCard: CardSchema.nullish(),
});
export type Deck = z.infer<typeof DeckSchema>;

export const GetDeckSchema = z.object({
  deckId: z.coerce.number<number>(),
});
export type GetDeckInput = z.infer<typeof GetDeckSchema>;

export const CreateDeckBodySchema = z.object({
  leagueId: z.number(),
  name: z.string(),
  commanderCardName: z.string(),
  partnerCardName: z.string().optional(),
});

export const UpdateDeckBodySchema = CreateDeckBodySchema.extend({
  cardQuantities: CreateCardQuantitySchema.array(),
}).partial();
