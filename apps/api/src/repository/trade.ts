import type { TradeStatus } from "@commander-league/contract/schemas";
import db, { type TX } from "../db";
import { tradeRequest } from "../db/schema";
import { eq } from "drizzle-orm";

export const listTradesWithParticipant = ({ userId }: { userId: string }) =>
  db.query.tradeRequest
    .findMany({
      with: {
        requester: { with: { user: true } },
        recipient: { with: { user: true } },
        requesterCardQuantities: { with: { card: true } },
        recipientCardQuantities: { with: { card: true } },
      },
      where: {
        OR: [
          {
            requesterId: userId,
          },
          {
            recipientId: userId,
          },
        ],
      },
    })
    .sync();

export const insertTradeRequest = (
  values: {
    requesterId: string;
    recipientId: string;
    requesterStatus: TradeStatus;
    recipientStatus: TradeStatus;
    requesterCollectionId: number;
    recipientCollectionId: number;
  },
  tx: TX,
) => {
  tx.insert(tradeRequest).values(values).run();
};

export const updateTradeStatus = ({
  tradeId,
  ...values
}: {
  tradeId: number;
  requesterStatus?: TradeStatus;
  recipientStatus?: TradeStatus;
}) => {
  db.update(tradeRequest).set(values).where(eq(tradeRequest.id, tradeId)).run();
};

export const getTradeMeta = ({ tradeId }: { tradeId: number }, tx: TX) =>
  tx.query.tradeRequest
    .findFirst({
      where: { id: tradeId },
      with: { requester: true, recipient: true },
    })
    .sync();

export const deleteTrade = ({ tradeId }: { tradeId: number }, tx: TX) => {
  tx.delete(tradeRequest).where(eq(tradeRequest.id, tradeId)).run();
};
