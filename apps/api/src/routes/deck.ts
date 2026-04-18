import { eq } from "drizzle-orm";
import { deck } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";
import { ORPCError } from "@orpc/server";
import { deckOwner, deckVisibile } from "../middleware/deck";
import { authGuard } from "../middleware/auth";
import { deleteCollection, setCollection } from "../services/collection";
import { createDeck, getDeck, getDeckCollectionId } from "../services/deck";

const listDecksController = base.deck.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findMany({
      where: { leagueId: input.leagueId, userId: input.userId },
    });
    return res;
  });

const getDeckController = base.deck.get
  .use(authGuard)
  .use(deckVisibile)
  .handler(async ({ input }) => {
    const deck = getDeck({ deckId: input.deckId });
    if (!deck) throw new ORPCError("NOT_FOUND");

    return deck;
  });

const createDeckController = base.deck.create
  .use(memberOfLeague)
  .handler(({ input, context }) => {
    const deckId = createDeck({
      userId: context.userId,
      leagueId: input.leagueId,
      name: input.name,
    });

    const deck = getDeck({ deckId });
    if (!deck) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return deck;
  });

const updateDeckController = base.deck.update
  .use(authGuard)
  .use(deckOwner)
  .handler(async ({ input, context }) => {
    context.env.db.transaction((tx) => {
      const collectionId = getDeckCollectionId({
        deckId: input.deckId,
        qc: tx,
      });
      if (!collectionId) throw new ORPCError("NOT_FOUND");

      const updates = {
        name: input.name,
      };
      if (Object.keys(updates).length !== 0) {
        context.env.db
          .update(deck)
          .set(updates)
          .where(eq(deck.id, input.deckId))
          .run();
      }

      if (input.cardQuantities)
        setCollection({
          collectionId,
          cardQuantities: input.cardQuantities,
          qc: tx,
        });
    });

    const res = getDeck({ deckId: input.deckId });
    if (!res) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return res;
  });

const deleteDeckController = base.deck.delete
  .use(authGuard)
  .use(deckOwner)
  .handler(({ input, context }) => {
    context.env.db.transaction((tx) => {
      const collectionId = getDeckCollectionId({
        deckId: input.deckId,
        qc: tx,
      });
      if (!collectionId) throw new ORPCError("NOT_FOUND");

      deleteCollection({ collectionId, qc: tx });

      tx.delete(deck).where(eq(deck.id, input.deckId));
    });
  });

export const deckRoutes = {
  list: listDecksController,
  get: getDeckController,
  create: createDeckController,
  update: updateDeckController,
  delete: deleteDeckController,
};
