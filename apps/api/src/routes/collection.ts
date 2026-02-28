import { card, collectionCard } from "../db/schema";
import { eq, and } from "drizzle-orm";
import type { CollectionCard } from "@commander-league/contract/schemas";
import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";

const getCollection = base.collection.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
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
  });

const setCollection = base.collection.set
  .use(selfOrLeagueOwner)
  .handler(async ({ input, context }) => {
    context.env.db.transaction((tx) => {
      tx.delete(collectionCard)
        .where(
          and(
            eq(collectionCard.leagueId, input.leagueId),
            eq(collectionCard.userId, input.userId),
          ),
        )
        .run();

      tx.insert(collectionCard)
        .values(
          input.cards.map(({ name, quantity }) => ({
            cardName: name,
            quantity,
            leagueId: input.leagueId,
            userId: input.userId,
          })),
        )
        .onConflictDoNothing()
        .run();
    });
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
