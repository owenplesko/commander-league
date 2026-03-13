import { oc } from "@orpc/contract";
import { GetLeagueSchema } from "../schemas";
import {
  CreateTradeRequestSchema,
  GetTradeSchema,
  TradeRequestSchema,
  UpdateTradeStatusSchema,
} from "../schemas/trade";

const listTrades = oc
  .route({ method: "GET", path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema)
  .output(TradeRequestSchema.array());

const createTrade = oc
  .route({ method: "POST", path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema.extend(CreateTradeRequestSchema.shape))
  .output(TradeRequestSchema);

const setTradeStatus = oc
  .route({
    method: "POST",
    path: "/league/{leagueId}/trade/{tradeId}/status",
    successStatus: 201,
  })
  .input(GetTradeSchema.extend(UpdateTradeStatusSchema.shape));

const deleteTrade = oc
  .route({
    method: "DELETE",
    path: "/league/{leagueId}/trade/{tradeId}",
    successStatus: 201,
  })
  .input(GetTradeSchema);

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
  delete: deleteTrade,
};
