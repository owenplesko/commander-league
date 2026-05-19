import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import db, { type TX } from "../db";
import * as repo from "../repository/";
import { withTransaction } from "./util";
import { applyCollectionDeltas } from "./collection";

export const listTradesWithParticipant = repo.listTradesWithParticipant;

export const createTrade = ({
  requesterId,
  recipientId,
  requesterCardQuantities,
  recipientCardQuantities,
}: {
  requesterId: string;
  recipientId: string;
  requesterCardQuantities: CreateCardQuantity[];
  recipientCardQuantities: CreateCardQuantity[];
}) => {
  db.transaction((tx) => {
    const { id: requesterCollectionId } = repo.insertCollection(tx);
    repo.insertCollectionCards(
      {
        collectionId: requesterCollectionId,
        cardQuantities: requesterCardQuantities,
      },
      tx,
    );

    const { id: recipientCollectionId } = repo.insertCollection(tx);
    repo.insertCollectionCards(
      {
        collectionId: recipientCollectionId,
        cardQuantities: recipientCardQuantities,
      },
      tx,
    );

    repo.insertTradeRequest(
      {
        requesterId,
        recipientId,
        requesterStatus: "pending",
        recipientStatus: "pending",
        requesterCollectionId,
        recipientCollectionId,
      },
      tx,
    );
  });
};

export const updateTradeStatus = repo.updateTradeStatus;

type TradeRole = "requester" | "recipient";

export function getTradeRole({
  tradeId,
  userId,
}: {
  tradeId: number;
  userId: string;
}):
  | { success: false; error: "not_found" }
  | { success: true; tradeRole: TradeRole | null } {
  return db.transaction((tx) => {
    const tradeMeta = repo.getTradeMeta({ tradeId }, tx);
    if (!tradeMeta) return { success: false, error: "not_found" };

    const tradeRole: TradeRole | null =
      userId === tradeMeta.requesterId
        ? "requester"
        : userId === tradeMeta.recipientId
          ? "recipient"
          : null;

    return { success: true, tradeRole };
  });
}

export const deleteTrade = ({ tradeId }: { tradeId: number }, tx?: TX) =>
  withTransaction(tx, (tx) => repo.deleteTrade({ tradeId }, tx));

type TradeResult =
  | { success: true }
  | { success?: boolean; error: "not_found" }
  | { success?: boolean; error: "not_accepted" }
  | {
      success?: boolean;
      error: "insufficient_cards";
      insufficientCardQuantities: CreateCardQuantity[];
    };

export function executeTrade({ tradeId }: { tradeId: number }): TradeResult {
  return db.transaction((tx) => {
    const tradeMeta = repo.getTradeMeta({ tradeId }, tx);
    if (!tradeMeta) return { success: false, error: "not_found" };

    if (
      !(
        tradeMeta.requesterStatus === "accepted" &&
        tradeMeta.recipientStatus === "accepted"
      )
    )
      return { success: false, error: "not_accepted" };

    // TODO: validate enough card quantity in collection
    const insufficientRequesterCardQuantities =
      repo.getInsufficientCardQuantities(
        {
          requiredCollectionId: tradeMeta.requesterCollectionId,
          availableCollectionId: tradeMeta.requester.collectionId,
        },
        tx,
      );
    const insufficientRecipientCardQuantities =
      repo.getInsufficientCardQuantities(
        {
          requiredCollectionId: tradeMeta.recipientCollectionId,
          availableCollectionId: tradeMeta.recipient.collectionId,
        },
        tx,
      );

    const insufficientCardQuantities = [
      ...insufficientRequesterCardQuantities,
      ...insufficientRecipientCardQuantities,
    ];

    if (insufficientCardQuantities.length > 0)
      return { error: "insufficient_cards", insufficientCardQuantities };

    const requesterCardQuantities = repo.getCollectionCardQuantities(
      { collectionId: tradeMeta.requesterCollectionId },
      tx,
    );

    const recipientCardQuantities = repo.getCollectionCardQuantities(
      { collectionId: tradeMeta.recipientCollectionId },
      tx,
    );

    const requesterDeltasMap = new Map(
      requesterCardQuantities.map(({ cardName, quantity }) => [
        cardName,
        -quantity,
      ]),
    );
    for (const { cardName, quantity } of recipientCardQuantities) {
      const existing = requesterDeltasMap.get(cardName) ?? 0;
      requesterDeltasMap.set(cardName, existing + quantity);
    }

    const requesterDeltas = Array.from(requesterDeltasMap.entries()).map(
      ([cardName, quantity]) => ({ cardName, quantity }),
    );

    const recipientDeltas = requesterDeltas.map(({ cardName, quantity }) => ({
      cardName,
      quantity: -quantity,
    }));

    applyCollectionDeltas(
      {
        collectionId: tradeMeta.requester.collectionId,
        cardDeltas: requesterDeltas,
      },
      tx,
    );

    applyCollectionDeltas(
      {
        collectionId: tradeMeta.recipient.collectionId,
        cardDeltas: recipientDeltas,
      },
      tx,
    );

    deleteTrade({ tradeId }, tx);

    return { success: true };
  });
}
