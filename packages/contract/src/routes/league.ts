import { oc } from "@orpc/contract";
import { InitializeLeagueSchema, LeagueSchema } from "../schemas";

const getLeague = oc
  .route({ method: "GET", path: "/league" })
  .output(LeagueSchema);

const initializeLeague = oc
  .route({ method: "POST", path: "/league" })
  .input(InitializeLeagueSchema);

export const leagueRoutes = {
  get: getLeague,
  initialize: initializeLeague,
};
