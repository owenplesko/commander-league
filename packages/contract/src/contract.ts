import { leagueRoutes } from "./routes/league";
import { collectionRoutes } from "./routes/collection";
import { tradeRoutes } from "./routes/trade";

export const contract = {
  league: leagueRoutes,
  collection: collectionRoutes,
  trade: tradeRoutes,
};
