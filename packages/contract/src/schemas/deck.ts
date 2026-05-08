import z from "zod";
import { UserSchema } from "./user";
import { CardSchema } from "./card";
import { CardQuantitySchema, CreateCardQuantitySchema } from "./collection";
import { MemberSchema } from "./member";

export const ListDeckParamsSchema = z.object({
  userId: UserSchema.shape.id.optional(),
});

export const DeckListEntrySchema = z.object({
  id: z.number(),
  commanderCard: CardSchema,
  owner: MemberSchema,
  name: z.string(),
});
export type DeckListEntry = z.infer<typeof DeckListEntrySchema>;

export const DeckSchema = DeckListEntrySchema.extend({
  id: z.number(),
  name: z.string(),
  owner: MemberSchema,
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
  name: z.string(),
  commanderCardName: z.string(),
  partnerCardName: z.string().nullable().optional(),
});

export const UpdateDeckBodySchema = z
  .object({
    name: z.string(),
    commanderCardName: z.string(),
    partnerCardName: z.string().nullish(),
  })
  .partial();

export const SetDeckCardsBodySchema = z.object({
  cardQuantities: CreateCardQuantitySchema.array(),
});

export const UpdateDeckCardsBodySchema = z.object({
  cardDeltas: CreateCardQuantitySchema.array(),
});
