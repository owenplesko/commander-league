import z from "zod";
import { UserSchema } from "./user";
import { CollectionSchema } from "./collection";
import { CardSchema } from "./card";

export const TradeItemsSchema = CollectionSchema;

export type TradeItems = z.infer<typeof TradeItemsSchema>;

export const TradeRequestSchema = z.object({
  id: z.number(),
  requester: UserSchema,
  recipient: UserSchema,
  requesterAccept: z.boolean(),
  recipientAccept: z.boolean(),
  requesterItems: TradeItemsSchema,
  recipientItems: TradeItemsSchema,
  //  updatedAt: z.iso.date(),
});

export type TradeRequest = z.infer<typeof TradeRequestSchema>;

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
