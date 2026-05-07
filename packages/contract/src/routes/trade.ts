import { oc } from "@orpc/contract";
import {
  CreateTradeRequestSchema,
  GetTradeSchema,
  TradeRequestSchema,
  UpdateTradeStatusSchema,
} from "../schemas";

const listTrades = oc
  .route({ method: "GET", path: "/trade" })
  .output(TradeRequestSchema.array());

const createTrade = oc
  .route({ method: "POST", path: "/trade", successStatus: 201 })
  .input(CreateTradeRequestSchema)
  .output(TradeRequestSchema);

const setTradeStatus = oc
  .route({
    method: "POST",
    path: "/trade/{tradeId}/status",
    successStatus: 204,
  })
  .input(GetTradeSchema.extend(UpdateTradeStatusSchema.shape));

const deleteTrade = oc
  .route({
    method: "DELETE",
    path: "/trade/{tradeId}",
    successStatus: 204,
  })
  .input(GetTradeSchema);

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
  delete: deleteTrade,
};
