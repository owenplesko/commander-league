import { memberOfLeague } from "../middleware/leagueMembership";
import { base } from "../orpc";

const listDecks = base.deck.list
  .use(memberOfLeague)
  .handler(async ({ input, context }) => {
    const res = await context.env.db.query.deck.findMany({
      where: { leagueId: input.leagueId, userId: input.userId },
    });
    return res;
  });

export const deckRoutes = { list: listDecks };
