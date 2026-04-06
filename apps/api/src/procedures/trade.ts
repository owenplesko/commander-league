import { eq, and, sql, inArray } from "drizzle-orm";
import type { TX } from "../db";
import {
  tradeSide,
  tradeItemCard,
  collectionCard,
  tradeRequest,
} from "../db/schema";

export function executeTrade(
  tx: TX,
  {
    tradeId,
    leagueId,
  }: {
    tradeId: number;
    leagueId: number;
  },
) {
  const targets = tx
    .select({ targetId: tradeSide.userId })
    .from(tradeSide)
    .where(eq(tradeSide.tradeId, tradeId))
    .as("targets");

  // compute deltas
  const cardDelta = tx
    .with(targets)
    .select({
      targetUserId: targets.targetId,
      leagueId: sql<number>`${leagueId}`.as("leagueId"),
      cardName: tradeItemCard.cardName,
      deltaQuantity: sql<number>`
            SUM(
              CASE WHEN ${targets.targetId} = ${tradeItemCard.userId} 
                THEN -${tradeItemCard.quantity}
                ELSE ${tradeItemCard.quantity}
              END
            )`.as("quantity"),
    })
    .from(tradeItemCard)
    .crossJoin(targets)
    .where(eq(tradeItemCard.tradeId, tradeId))
    .groupBy(targets.targetId, tradeItemCard.cardName)
    .as("card_delta");

  // compute target quantites
  const cardTargetQuantities = tx
    .select({
      targetUserId: cardDelta.targetUserId,
      leagueId: cardDelta.leagueId,
      cardName: cardDelta.cardName,
      targetQuantity:
        sql<number>`COALESCE(${collectionCard.quantity}, 0) + ${cardDelta.deltaQuantity}`.as(
          "targetQuantity",
        ),
    })
    .from(cardDelta)
    .leftJoin(
      collectionCard,
      and(
        eq(collectionCard.userId, cardDelta.targetUserId),
        eq(collectionCard.leagueId, cardDelta.leagueId),
        eq(collectionCard.cardName, cardDelta.cardName),
      ),
    )
    .all();

  // apply deletes
  const toDelete = cardTargetQuantities.filter((r) => r.targetQuantity === 0);
  tx.delete(collectionCard)
    .where(
      inArray(
        sql`(${collectionCard.userId}, ${collectionCard.leagueId}, ${collectionCard.cardName})`,
        toDelete.map(
          (r) => sql`(${r.targetUserId}, ${r.leagueId}, ${r.cardName})`,
        ),
      ),
    )
    .run();

  // apply upserts
  const toUpsert = cardTargetQuantities.filter((r) => r.targetQuantity !== 0);
  tx.insert(collectionCard)
    .values(
      toUpsert.map((r) => ({
        userId: r.targetUserId,
        leagueId: r.leagueId,
        cardName: r.cardName,
        quantity: r.targetQuantity,
      })),
    )
    .onConflictDoUpdate({
      target: [
        collectionCard.userId,
        collectionCard.leagueId,
        collectionCard.cardName,
      ],
      set: {
        quantity: sql`excluded.quantity`,
      },
    })
    .run();

  // clean up trade request
  tx.delete(tradeRequest).where(eq(tradeRequest.id, tradeId)).run();
}
