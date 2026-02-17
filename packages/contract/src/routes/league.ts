import { oc } from "@orpc/contract";
import z from "zod";
import {
  CreateLeagueSchema,
  GetLeagueSchema,
  LeagueSchema,
  UpdateLeagueSchema,
} from "../schemas/league.ts";

const listLeagues = oc
  .route({
    method: "GET",
    path: "/league",
  })
  .output(LeagueSchema.array());

const getLeague = oc
  .route({
    method: "GET",
    path: "/league/{leagueId}",
  })
  .input(GetLeagueSchema)
  .output(LeagueSchema);

const createLeague = oc
  .route({ method: "POST", path: "/league", successStatus: 201 })
  .input(CreateLeagueSchema)
  .output(z.object({ leagueId: LeagueSchema.shape.id }));

const updateLeague = oc
  .route({ method: "PATCH", path: "/league/{leagueId}", successStatus: 204 })
  .input(UpdateLeagueSchema);

const deleteLeague = oc
  .route({ method: "DELETE", path: "/league/{leagueId}", successStatus: 204 })
  .input(GetLeagueSchema);

export const leagueRoutes = {
  list: listLeagues,
  get: getLeague,
  create: createLeague,
  update: updateLeague,
  delete: deleteLeague,
};
