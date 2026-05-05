import { base } from "../orpc";
import {
  memberOfLeague,
  selfOrLeagueOwner,
} from "../middleware/leagueMembership";
import { ORPCError } from "@orpc/server";
import { setCollection } from "../services/collection";
import { getLeagueMemberCollectionId } from "../services/leagueMember";
import db from "../db";
import { getInvalidCardNames } from "../services/card";

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
  .handler(async ({ input, errors }) => {
    const invalidCardNames = getInvalidCardNames({
      cardNames: input.cardQuantites.map(({ cardName }) => cardName),
    });
    if (invalidCardNames.length > 0) {
      throw errors.BAD_REQUEST({
        data: {
          invalidCardNames,
        },
      });
    }

    db.transaction((tx) => {
      const collectionId = getLeagueMemberCollectionId({
        userId: input.userId,
        leagueId: input.leagueId,
        qc: tx,
      });
      if (!collectionId) throw new ORPCError("NOT_FOUND");

      setCollection({
        collectionId,
        cardQuantities: input.cardQuantites,
      });
    });
  });

export const collectionRoutes = {
  get: getCollectionController,
  set: setCollectionController,
};
