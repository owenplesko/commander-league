import z from "zod";
import { UserSchema } from "./user";
import { CollectionSchema, CreateCollectionSchema } from "./collection";

export const TradeRequestSchema = z.object({
  id: z.number(),
  requester: UserSchema,
  recipient: UserSchema,
  requesterAccept: z.boolean(),
  recipientAccept: z.boolean(),
  requesterItems: CollectionSchema,
  recipientItems: CollectionSchema,
  updatedAt: z.iso.date(),
});

export type TradeRequest = z.infer<typeof TradeRequestSchema>;

export const CreateTradeRequestSchema = z.object({
  requesterId: UserSchema.shape.id,
  recipientId: UserSchema.shape.id,
  recipientItems: CreateCollectionSchema,
  requesterItems: CreateCollectionSchema,
});
