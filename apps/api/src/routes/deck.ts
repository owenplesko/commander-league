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

export const deckRoutes = { list: listDecks, get: getDeck };
