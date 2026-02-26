import z from "zod";
import { CardSchema } from "./card";
import { LeagueSchema } from "./league";
import { GetLeagueMemberSchema } from "./leagueMember";

export const CollectionCardSchema = CardSchema.extend({
  quantity: z.number(),
});

export type CollectionCard = z.infer<typeof CollectionCardSchema>;

export const CollectionSchema = z.object({
  cards: CollectionCardSchema.array(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const GetCollectionSchema = z.object({
  leagueId: LeagueSchema.shape.id,
  // TODO: ref player schema
  userId: z.string(),
});

export const SetCollectionSchema = GetLeagueMemberSchema.extend({
  cards: CollectionCardSchema.pick({ name: true, quantity: true }).array(),
});
