import { leagueRoutes } from "./routes/league";
import { collectionRoutes } from "./routes/collection";
import { tradeRoutes } from "./routes/trade";
import { deckRoutes } from "./routes/deck";
import { cardRoutes } from "./routes/card";

export const contract = {
  card: cardRoutes,
  league: leagueRoutes,
  collection: collectionRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
};
