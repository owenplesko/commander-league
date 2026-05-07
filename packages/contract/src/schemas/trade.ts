import z from "zod";
import { UserSchema } from "./user";
import { CardQuantitySchema, CreateCardQuantitySchema } from "./collection";

const tradeStatusValues = ["accepted", "pending", "rejected"] as const;

export const TradeStatusSchema = z.enum(tradeStatusValues);
export type TradeStatus = z.infer<typeof TradeStatusSchema>;

export const TradeRequestSchema = z.object({
  id: z.number(),
  requester: UserSchema,
  requesterStatus: TradeStatusSchema,
  requesterCardQuantities: CardQuantitySchema.array(),
  recipient: UserSchema,
  recipientStatus: TradeStatusSchema,
  recipientCardQuantities: CardQuantitySchema.array(),
});
export type TradeRequest = z.infer<typeof TradeRequestSchema>;

export const GetTradeSchema = z.object({
  tradeId: z.coerce.number<number>(),
});
export type GetTradeInput = z.infer<typeof GetTradeSchema>;

export const CreateTradeRequestSchema = z.object({
  offerCardQuantities: CreateCardQuantitySchema.array(),
  recipientId: UserSchema.shape.id,
  recipientCardQuantities: CreateCardQuantitySchema.array(),
});
export type CreateTradeRequestBody = z.infer<typeof CreateTradeRequestSchema>;

export const UpdateTradeStatusSchema = z.object({
  status: TradeStatusSchema,
});
