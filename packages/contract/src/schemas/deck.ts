import z from "zod";
import { UserSchema } from "./user";
import {
  CardQuantitySchema,
  CardSchema,
  CreateCardQuantitySchema,
} from "./card";
import { GetLeagueSchema } from "./league";

export const DeckListEntrySchema = z.object({
  id: z.number(),
  displayCardName: CardSchema.shape.name.nullable(),
  name: z.string(),
});
export type DeckListEntry = z.infer<typeof DeckListEntrySchema>;

export const DeckSchema = DeckListEntrySchema.extend({
  id: z.number(),
  name: z.string(),
  owner: UserSchema,
  cards: CardQuantitySchema.array(),
});
export type Deck = z.infer<typeof DeckSchema>;

export const GetDeckSchema = GetLeagueSchema.extend({
  deckId: z.coerce.number<number>(),
});

export const CreateDeckBodySchema = z.object({
  name: z.string(),
  displayCardName: z.string(),
  cards: CreateCardQuantitySchema.array().nullish(),
});
