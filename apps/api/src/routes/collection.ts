import { card, collectionCard } from "../db/schema";
import { eq, and, sql, isNull } from "drizzle-orm";
import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";
import { except } from "drizzle-orm/sqlite-core";
import { ORPCError } from "@orpc/server";

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
  .handler(async ({ input, context, errors }) => {
    context.env.db.transaction((tx) => {
      tx.delete(collectionCard)
        .where(
          and(
            eq(collectionCard.leagueId, input.leagueId),
            eq(collectionCard.userId, input.userId),
          ),
        )
        .run();

      const valuesSql = sql.join(
        input.cards.map((c) => sql`(${c.cardName})`),
        sql`,`,
      );

      const inputCardsSubquery = tx
        .select({ cardName: sql<string>`column1`.as("cardName") })
        .from(sql`(values ${valuesSql})`)
        .as("input_cards");

      const invalidCards = tx
        .select({ cardName: inputCardsSubquery.cardName })
        .from(inputCardsSubquery)
        .leftJoin(card, eq(inputCardsSubquery.cardName, card.name))
        .where(isNull(card.name))
        .all();

      if (invalidCards.length > 0) {
        throw errors.BAD_REQUEST({
          data: {
            invalidCardNames: invalidCards.map(({ cardName }) => cardName),
          },
        });
      }

      tx.insert(collectionCard)
        .values(
          input.cards.map(({ cardName, quantity }) => ({
            cardName,
            quantity,
            leagueId: input.leagueId,
            userId: input.userId,
          })),
        )
        .run();
    });
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
