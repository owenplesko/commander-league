import { card, collectionCard } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { os } from "./base";

const getCollection = os.collection.get.handler(({ input, context }) => {
  const cards = context.env.db
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
        eq(collectionCard.playerId, input.userId),
      ),
    );

  return { cards };
});

const setCollection = os.collection.set.handler(() => {});

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
