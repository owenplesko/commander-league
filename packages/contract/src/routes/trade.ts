import { oc } from "@orpc/contract";
import { GetLeagueSchema } from "../schemas";
import { CreateTradeRequestSchema, TradeRequestSchema } from "../schemas/trade";

const listTrades = oc
  .route({ path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema)
  .output(TradeRequestSchema.array());

const createTrade = oc
  .route({ method: "POST", path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema.extend(CreateTradeRequestSchema.shape))
  .output(TradeRequestSchema);

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
};
