import { eq } from "drizzle-orm";
import { deck } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";
import { ORPCError } from "@orpc/server";
import { deckOwner, deckVisibile } from "../middleware/deck";
import { authGuard } from "../middleware/auth";
import {
  createCollection,
  deleteCollection,
  setCollection,
} from "../services/collection";

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
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findFirst({
      where: { id: input.deckId },
      with: { owner: true, cardQuantities: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const createDeckController = base.deck.create
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const deckId = context.env.db.transaction((tx) => {
      const { collectionId } = createCollection(tx);

      if (input.cardQuantities.length > 0)
        setCollection(tx, {
          collectionId,
          cardQuantities: input.cardQuantities,
        });

      const { deckId } = tx
        .insert(deck)
        .values({
          userId: context.userId,
          leagueId: input.leagueId,
          name: input.name,
          collectionId,
        })
        .returning({ deckId: deck.id })
        .get();

      return deckId;
    });

    const res = await context.env.db.query.deck.findFirst({
      where: { id: deckId },
      with: { owner: true, cardQuantities: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return res;
  });

const updateDeckController = base.deck.update
  .use(authGuard)
  .use(deckOwner)
  .handler(async ({ input, context }) => {
    context.env.db.transaction((tx) => {
      const res = context.env.db
        .select()
        .from(deck)
        .where(eq(deck.id, input.deckId))
        .get();

      if (!res) throw new ORPCError("NOT_FOUND");

      const { collectionId } = res;

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
        setCollection(tx, {
          collectionId,
          cardQuantities: input.cardQuantities,
        });
    });

    const res = await context.env.db.query.deck.findFirst({
      where: { id: input.deckId },
      with: { owner: true, cardQuantities: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return res;
  });

const deleteDeckController = base.deck.delete
  .use(authGuard)
  .use(deckOwner)
  .handler(({ input, context }) => {
    context.env.db.transaction((tx) => {
      const res = context.env.db
        .select()
        .from(deck)
        .where(eq(deck.id, input.deckId))
        .get();

      if (!res) throw new ORPCError("NOT_FOUND");

      const { collectionId } = res;

      deleteCollection(tx, { collectionId });

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
