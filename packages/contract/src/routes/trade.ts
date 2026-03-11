import { oc } from "@orpc/contract";
import { GetLeagueSchema } from "../schemas";
import {
  CreateTradeRequestSchema,
  GetTradeSchema,
  TradeRequestSchema,
  UpdateTradeStatusSchema,
} from "../schemas/trade";
import z from "zod";

const listTrades = oc
  .route({ method: "GET", path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema)
  .output(TradeRequestSchema.array());

const createTrade = oc
  .route({ method: "POST", path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema.extend(CreateTradeRequestSchema.shape))
  .output(z.object({ tradeId: TradeRequestSchema.shape.id }));

const setTradeStatus = oc
  .route({
    method: "POST",
    path: "/league/{leagueId}/trade/status",
    successStatus: 201,
  })
  .input(GetTradeSchema.extend(UpdateTradeStatusSchema.shape));

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
};
