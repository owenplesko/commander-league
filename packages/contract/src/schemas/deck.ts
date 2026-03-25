import z from "zod";
import { UserSchema } from "./user";
import { CardSchema } from "./card";
import { GetLeagueSchema } from "./league";

export const DeckListEntrySchema = z.object({
  id: z.number(),
  displayCardName: CardSchema.shape.name.nullable(),
  name: z.string(),
});
export type DeckListEntry = z.infer<typeof DeckListEntrySchema>;

export const DeckCardSchema = z.object({
  deckId: z.number(),
  quantity: z.number(),
  card: CardSchema,
});
export type DeckCard = z.infer<typeof DeckCardSchema>;

export const DeckSchema = DeckListEntrySchema.extend({
  id: z.number(),
  name: z.string(),
  owner: UserSchema,
  cards: DeckCardSchema.array(),
});
export type Deck = z.infer<typeof DeckSchema>;

export const GetDeckSchema = GetLeagueSchema.extend({
  deckId: z.coerce.number<number>(),
});
