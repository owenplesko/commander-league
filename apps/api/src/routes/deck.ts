import { and, eq } from "drizzle-orm";
import { deck } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";
import { ORPCError } from "@orpc/server";
import { deckOwner, deckVisibile } from "../middleware/deck";
import { authGuard } from "../middleware/auth";

const listDecks = base.deck.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findMany({
      where: { leagueId: input.leagueId, userId: input.userId },
    });
    return res;
  });

const getDeck = base.deck.get
  .use(authGuard)
  .use(deckVisibile)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findFirst({
      where: { id: input.deckId },
      with: { owner: true, collection: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("NOT_FOUND");

    return res;
  });

const createDeck = base.deck.create
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const deckId = context.env.db.transaction((tx) => {
      const { deckId } = tx
        .insert(deck)
        .values({
          userId: context.userId,
          leagueId: input.leagueId,
          name: input.name,
          displayCardName: input.displayCardName,
        })
        .returning({ deckId: deck.id })
        .get();

      if (input.cards && input.cards.length > 0) {
        tx.insert(deckCard)
          .values(input.cards.map((entry) => ({ deckId, ...entry })))
          .run();
      }

      return deckId;
    });

    const res = await context.env.db.query.deck.findFirst({
      where: { id: deckId },
      with: { owner: true, cards: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return res;
  });

const updateDeck = base.deck.update
  .use(authGuard)
  .use(deckOwner)
  .handler(async ({ input, context }) => {
    context.env.db.transaction((tx) => {
      // validate deck in league
      const existing = context.env.db
        .select()
        .from(deck)
        .where(eq(deck.id, input.deckId))
        .get();

      if (!existing) throw new ORPCError("NOT_FOUND");

      const updates = {
        name: input.name,
        displayCardName: input.displayCardName,
      };
      if (Object.keys(updates).length !== 0) {
        context.env.db
          .update(deck)
          .set(updates)
          .where(eq(deck.id, input.deckId))
          .run();
      }

      if (input.cards && input.cards.length > 0) {
        tx.delete(deckCard)
          .where(and(eq(deckCard.deckId, input.deckId)))
          .run();

        tx.insert(deckCard)
          .values(
            input.cards.map((entry) => ({ deckId: input.deckId, ...entry })),
          )
          .run();
      }
    });

    const res = await context.env.db.query.deck.findFirst({
      where: { id: input.deckId },
      with: { owner: true, cards: { with: { card: true } } },
    });

    if (!res) throw new ORPCError("INTERNAL_SERVER_ERROR");

    return res;
  });

const deleteDeck = base.deck.delete
  .use(authGuard)
  .use(deckOwner)
  .handler(async ({ input, context }) => {
    await context.env.db.delete(deck).where(eq(deck.id, input.deckId));
  });

export const deckRoutes = {
  list: listDecks,
  get: getDeck,
  create: createDeck,
  update: updateDeck,
  delete: deleteDeck,
};
