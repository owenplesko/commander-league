import z from "zod";
import { UserSchema } from "./user";
import { CollectionCardSchema } from "./collection";
import { GetLeagueSchema } from "./league";
import { CardSchema } from "./card";

const tradeStatusValues = ["accepted", "pending", "rejected"] as const;

export const TradeStatusSchema = z.enum(tradeStatusValues);
export type TradeStatus = z.infer<typeof TradeStatusSchema>;

export const TradeSideSchema = z.object({
  user: UserSchema,
  status: TradeStatusSchema,
  cards: CollectionCardSchema.array(),
});
export type TradeSide = z.infer<typeof TradeSideSchema>;

export const TradeRequestSchema = z.object({
  id: z.number(),
  ownerId: UserSchema.shape.id,
  sides: TradeSideSchema.array(),
  //  updatedAt: z.iso.date(),
});
export type TradeRequest = z.infer<typeof TradeRequestSchema>;

export const GetTradeSchema = GetLeagueSchema.extend({
  tradeId: z.coerce.number<number>(),
});
export type GetTradeInput = z.infer<typeof GetTradeSchema>;

export const CreateTradeRequestSchema = z.object({
  sides: z
    .object({
      userId: UserSchema.shape.id,
      cards: z
        .object({
          cardName: CardSchema.shape.name,
          quantity: z.number().positive(),
        })
        .array(),
    })
    .array()
    .length(2, "must have exactly two sides"),
});
export type CreateTradeRequestBody = z.infer<typeof CreateTradeRequestSchema>;

export const UpdateTradeStatusSchema = z.object({
  status: TradeStatusSchema,
});
