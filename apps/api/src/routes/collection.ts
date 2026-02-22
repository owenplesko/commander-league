import { card, collectionCard } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { base } from "./base";
import type { CollectionCard } from "@commander-league/contract/schemas";

const getCollection = base.collection.get.handler(
  async ({ input, context }) => {
    const cards: CollectionCard[] = await context.env.db
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
          eq(collectionCard.userId, input.userId),
        ),
      );

    return { cards };
  },
);

const setCollection = base.collection.set.handler(() => {});

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
