import { collectionRoutes } from "./collection";
import { leagueRoutes } from "./league";
import { tradeRoutes } from "./trade";
import { base } from "../orpc";
import { deckRoutes } from "./deck";
import { cardRoutes } from "./card";

export const routes = base.router({
  card: cardRoutes,
  collection: collectionRoutes,
  league: leagueRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
});
