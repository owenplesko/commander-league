import { collectionCard } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";

const getCollection = base.collection.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const cards = await context.env.db.query.collectionCard.findMany({
      where: {
        leagueId: input.leagueId,
        userId: input.userId,
      },
      with: { card: true },
    });

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
          input.cards.map(({ cardName, quantity }) => ({
            cardName,
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
