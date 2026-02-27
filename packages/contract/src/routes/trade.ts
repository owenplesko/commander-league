import { oc } from "@orpc/contract";
import { GetLeagueSchema } from "../schemas";
import { CreateTradeRequestSchema, TradeRequestSchema } from "../schemas/trade";

const listTrades = oc
  .route({ path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema)
  .output(TradeRequestSchema.array());

const createTrade = oc
  .route({ path: "/league/{leagueId}/trade" })
  .input(GetLeagueSchema.extend(CreateTradeRequestSchema.shape))
  .output(TradeRequestSchema);
