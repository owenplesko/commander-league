import { leagueRoutes } from "./routes/league";
import { collectionRoutes } from "./routes/collection";
import { tradeRoutes } from "./routes/trade";
import { deckRoutes } from "./routes/deck";
import { cardRoutes } from "./routes/card";
import { memberRoutes } from "./routes/member";
import { settingsRoutes } from "./routes/settings";
import { userRoutes } from "./routes/user";
import { packRoutes } from "./routes/pack";

export const contract = {
  card: cardRoutes,
  collection: collectionRoutes,
  deck: deckRoutes,
  league: leagueRoutes,
  member: memberRoutes,
  settings: settingsRoutes,
  trade: tradeRoutes,
  user: userRoutes,
  pack: packRoutes,
};
