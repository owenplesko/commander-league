import { card } from "../db/schema";
import { eq, sql, isNull } from "drizzle-orm";
import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";
import { ORPCError } from "@orpc/server";
import { setCollection } from "../services/collection";

const getCollectionController = base.collection.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.leagueMember.findFirst({
      columns: {},
      where: {
        leagueId: input.leagueId,
        userId: input.userId,
      },
      with: {
        collection: { with: { cardQuantities: { with: { card: true } } } },
      },
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    return res.collection;
  });

const setCollectionController = base.collection.set
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

      const valuesSql = sql.join(
        input.cardQuantites.map((c) => sql`(${c.cardName})`),
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

      setCollection(tx, {
        collectionId,
        cardQuantities: input.cardQuantites,
      });
    });
  });

export const collectionRoutes = {
  get: getCollectionController,
  set: setCollectionController,
};
