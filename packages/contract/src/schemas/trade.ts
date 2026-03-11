import z from "zod";
import { UserSchema } from "./user";
import { CollectionSchema } from "./collection";
import { CardSchema } from "./card";
import { GetLeagueSchema } from "./league";

export const TradeItemsSchema = CollectionSchema;

export type TradeItems = z.infer<typeof TradeItemsSchema>;

const tradeStatusValues = ["accepted", "pending", "rejected"] as const;

export const TradeStatusSchema = z.enum(tradeStatusValues);
export type TradeStatus = z.infer<typeof TradeStatusSchema>;

export const TradeRequestSchema = z.object({
  id: z.number(),
  requester: UserSchema,
  recipient: UserSchema,
  requesterStatus: TradeStatusSchema,
  recipientStatus: TradeStatusSchema,
  requesterItems: TradeItemsSchema,
  recipientItems: TradeItemsSchema,
  //  updatedAt: z.iso.date(),
});

export type TradeRequest = z.infer<typeof TradeRequestSchema>;

export const GetTradeSchema = GetLeagueSchema.extend({
  tradeId: z.coerce.number<number>(),
});
export type GetTradeInput = z.infer<typeof GetTradeSchema>;

const CreateTradeRequestItemsSchema = z.object({
  cards: z
    .object({ cardName: CardSchema.shape.name, quantity: z.number() })
    .array(),
});

export const CreateTradeRequestSchema = z.object({
  recipientId: UserSchema.shape.id,
  recipientItems: CreateTradeRequestItemsSchema,
  requesterItems: CreateTradeRequestItemsSchema,
});

export type CreateTradeRequestBody = z.infer<typeof CreateTradeRequestSchema>;

export const UpdateTradeStatusSchema = z.object({
  status: TradeStatusSchema,
});
