import { card, collectionCard } from "../db/schema";
import { eq, sql, isNull } from "drizzle-orm";
import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";
import { ORPCError } from "@orpc/server";

const getCollection = base.collection.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.leagueMember.findFirst({
      where: {
        leagueId: input.leagueId,
        userId: input.userId,
      },
      with: {
        collection: { with: { cardQuantities: { with: { card: true } } } },
      },
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    return { cards: res.collection.cardQuantities };
  });

const setCollection = base.collection.set
  .use(selfOrLeagueOwner)
  .handler(async ({ input, context, errors }) => {
    context.env.db.transaction((tx) => {
      const res = tx.query.leagueMember
        .findFirst({
          columns: { collectionId: true },
          where: {
            userId: input.userId,
            leagueId: input.leagueId,
          },
        })
        .sync();
      if (!res) throw new ORPCError("NOT_FOUND");
      const { collectionId } = res;

      tx.delete(collectionCard)
        .where(eq(collectionCard.collectionId, collectionId))
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
            collectionId,
          })),
        )
        .onConflictDoUpdate({
          target: [collectionCard.collectionId, collectionCard.cardName],
          set: {
            quantity: sql`${collectionCard.quantity} + excluded.quantity`,
          },
        })
        .run();
    });
  });

export const collectionRoutes = {
  get: getCollection,
  set: setCollection,
};
