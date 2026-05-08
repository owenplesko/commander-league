import { collectionRoutes } from "./collection";
import { leagueRoutes } from "./league";
import { tradeRoutes } from "./trade";
import { deckRoutes } from "./deck";
import { cardRoutes } from "./card";
import { base } from "../orpc";
import { memberRoutes } from "./member";
import { settingsRoutes } from "./settings";
import { userRoutes } from "./user";

export const routes = base.router({
  card: cardRoutes,
  collection: collectionRoutes,
  league: leagueRoutes,
  member: memberRoutes,
  settings: settingsRoutes,
  trade: tradeRoutes,
  deck: deckRoutes,
  user: userRoutes,
});
