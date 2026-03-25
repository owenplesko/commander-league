import { deck, deckCard } from "../db/schema";
import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";
import { ORPCError } from "@orpc/server";

const listDecks = base.deck.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findMany({
      where: { leagueId: input.leagueId, userId: input.userId },
    });
    return res;
  });

const getDeck = base.deck.get
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findFirst({
      where: { id: input.deckId, leagueId: input.leagueId },
      with: { owner: true, cards: { with: { card: true } } },
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

export const deckRoutes = { list: listDecks, get: getDeck, create: createDeck };
