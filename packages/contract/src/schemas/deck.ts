import z from "zod";
import { LeagueSchema } from "./league";
import { UserSchema } from "./user";
import { CardSchema } from "./card";

export const DeckListEntrySchema = z.object({
  id: z.number(),
  leagueId: LeagueSchema.shape.id,
  userId: UserSchema.shape.id,
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
  cards: DeckCardSchema.array(),
});
export type Deck = z.infer<typeof DeckSchema>;
