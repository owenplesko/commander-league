import { authed } from "../orpc";
import * as service from "../services/";

const getLeague = authed.league.get.handler(() => {
  const league = service.getLeague();
  return league;
});

const initializeLeague = authed.league.initialize.handler(
  ({ input, context }) => {
    service.initializeLeague({ name: input.name, ownerId: context.userId });
  },
);

export const leagueRoutes = {
  get: getLeague,
  initialize: initializeLeague,
};
