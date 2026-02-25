import { card, collectionCard } from "../db/schema";
import { eq, and } from "drizzle-orm";
import type { CollectionCard } from "@commander-league/contract/schemas";
import { pub } from "../orpc";
import {
  leagueMemberGuard,
  leagueOwnerGuard,
} from "../middleware/leagueMembership";

const getCollection = pub.collection.get
  .use(leagueMemberGuard)
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

const setCollection = pub.collection.set
  .use(leagueOwnerGuard)
  .handler(() => {});

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
