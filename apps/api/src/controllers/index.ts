import { collectionRoutes } from "./collection";
import { leagueRoutes } from "./league";
import { tradeRoutes } from "./trade";
import { public } from "../orpc";
import { deckRoutes } from "./deck";
import { cardRoutes } from "./card";

export const routes = public.router({
  card: cardRoutes,
  collection: collectionRoutes,
  league: leagueRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
});
