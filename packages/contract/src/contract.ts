import { leagueRoutes } from "./routes/league";
import { collectionRoutes } from "./routes/collection";
import { tradeRoutes } from "./routes/trade";
import { deckRoutes } from "./routes/deck";

export const contract = {
  league: leagueRoutes,
  collection: collectionRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
};
