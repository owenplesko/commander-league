import { ORPCError } from "@orpc/server";
import { tradeParticipantMiddleware } from "../middleware/trade";
import { member } from "../middleware/member";

import * as service from "../services/";

const listTrades = member.trade.list.handler(async ({ context }) => {
  const trades = service.listTradesWithParticipant({
    userId: context.userId,
  });
  return trades;
});

const createTrade = member.trade.create.handler(
  ({
    input: { recipientId, offerCardQuantities, recipientCardQuantities },
    context,
  }) => {
    service.createTrade({
      requesterId: context.userId,
      recipientId,
      requesterCardQuantities: offerCardQuantities,
      recipientCardQuantities,
    });
  },
);

const setTradeStatus = member.trade.setStatus
  .use(tradeParticipantMiddleware)
  .handler(({ input: { tradeId, status }, context: { tradeRole } }) => {
    service.updateTradeStatus({
      tradeId,
      requesterStatus: tradeRole === "requester" ? status : undefined,
      recipientStatus: tradeRole === "recipient" ? status : undefined,
    });

    // try to execute trade if can, silent failure is okay
    service.executeTrade({ tradeId });
  });

const executeTrade = member.trade.execute
  .use(tradeParticipantMiddleware)
  .handler(({ input: { tradeId }, errors }) => {
    const res = service.executeTrade({ tradeId });
    if (res.success) return;

    switch (res.error) {
      case "not_found":
        throw new ORPCError("NOT_FOUND");
      case "not_accepted":
        throw new ORPCError("PRECONDITION_FAILED");
      case "insufficient_cards":
        throw errors.CONFLICT({
          data: { insufficientCardQuantities: res.insufficientCardQuantities },
        });
    }
  });

const deleteTrade = member.trade.delete
  .use(tradeParticipantMiddleware)
  .handler(({ input: { tradeId } }) => {
    service.deleteTrade({ tradeId });
  });

export const tradeRoutes = {
  list: listTrades,
  create: createTrade,
  setStatus: setTradeStatus,
  execute: executeTrade,
  delete: deleteTrade,
};
