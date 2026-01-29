import * as z from "zod";
import { CollectionCardSchema } from "../schemas/card";
import { card, collectionCard } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { os } from "@orpc/server";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export const base = os.$context<{
  headers: Headers;
  userId: string | null;
  env: {
    db: BunSQLiteDatabase;
  };
}>();

export const pong = base.handler(() => {
  return "pong";
});

const InputSchema = z.object({ leagueId: z.number(), playerId: z.number() });

export const listCollectionCards = base
  .route({ method: "GET", path: "/{leagueId}/{playerId}/collection" })
  .input(InputSchema)
  .output(CollectionCardSchema.array())
  .handler(({ input, context }) => {
    return context.env.db
      .select({
        name: card.name,
        data: card.data,
        quantity: collectionCard.quantity,
      })
      .from(collectionCard)
      .innerJoin(card, eq(collectionCard.cardName, card.name))
      .where(
        and(
          eq(collectionCard.leagueId, input.leagueId),
          eq(collectionCard.playerId, input.playerId),
        ),
      );
  });

const InsertInputSchema = InputSchema.extend({
  collectionCards: CollectionCardSchema.pick({
    name: true,
    quantity: true,
  }).array(),
});

export const setCollectionCards = base
  .route({ method: "PUT", path: "/{leagueId}/{playerId}/collection" })
  .input(InsertInputSchema)
  .handler(async ({ input, context }) => {
    await context.env.db.transaction(async (tx) => {
      await tx
        .delete(collectionCard)
        .where(
          and(
            eq(collectionCard.leagueId, input.leagueId),
            eq(collectionCard.playerId, input.playerId),
          ),
        );
      await tx.insert(collectionCard).values(
        input.collectionCards.map((card) => ({
          leagueId: input.leagueId,
          playerId: input.playerId,
          quantity: card.quantity,
          cardName: card.name,
        })),
      );
    });
  });

export const addCollectionCards = base
  .route({ method: "PATCH", path: "/{leagueId}/{playerId}/collection" })
  .input(InsertInputSchema)
  .handler(async ({ input, context }) => {
    await context.env.db
      .insert(collectionCard)
      .values(
        input.collectionCards.map((card) => ({
          leagueId: input.leagueId,
          playerId: input.playerId,
          quantity: card.quantity,
          cardName: card.name,
        })),
      )
      .onConflictDoUpdate({
        target: [
          collectionCard.cardName,
          collectionCard.leagueId,
          collectionCard.playerId,
        ],
        set: { quantity: sql`${collectionCard.quantity} + excluded.quantity` },
      });
  });

const DeleteInputSchema = InputSchema.and(
  CollectionCardSchema.pick({
    name: true,
    quantity: true,
  }),
);

export const removeCollectionCard = base
  .route({
    method: "GET",
    path: "/{leagueId}/{playerId}/collection/{name}",
  })
  .input(DeleteInputSchema)
  .handler(async ({ input, context }) => {
    await context.env.db
      .update(collectionCard)
      .set({
        quantity: sql`${collectionCard.quantity} - ${input.quantity}`,
      })
      .where(
        and(
          eq(collectionCard.leagueId, input.leagueId),
          eq(collectionCard.playerId, input.playerId),
          eq(collectionCard.cardName, input.name),
        ),
      );
  });

export const collectionRoutes = {
  ping: pong,
  list: listCollectionCards,
  set: setCollectionCards,
  add: addCollectionCards,
  remove: removeCollectionCard,
};
