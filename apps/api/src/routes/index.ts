import { collectionRoutes } from "./collection";
import { leagueRoutes } from "./league";
import { tradeRoutes } from "./trade";
import { base } from "../orpc";
import { deckRoutes } from "./deck";

export const routes = base.router({
  collection: collectionRoutes,
  league: leagueRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
});
