import { oc } from "@orpc/contract";
import {
  CreateLeagueSchema,
  GetLeagueSchema,
  LeagueSchema,
  UpdateLeagueSchema,
} from "../schemas/league.ts";
import {
  GetLeagueMemberSchema,
  LeagueMemberSchema,
} from "../schemas/leagueMember.ts";
import {
  InviteCodeSchema,
  UpdateInviteCodeSchema,
} from "../schemas/inviteCode.ts";

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
  .output(LeagueSchema);

const updateLeague = oc
  .route({ method: "PATCH", path: "/league/{leagueId}", successStatus: 204 })
  .input(UpdateLeagueSchema);

const deleteLeague = oc
  .route({ method: "DELETE", path: "/league/{leagueId}", successStatus: 204 })
  .input(GetLeagueSchema);

const getInviteCode = oc
  .route({
    method: "GET",
    path: "/league/{leagueId}/invite-code",
  })
  .input(GetLeagueSchema)
  .output(InviteCodeSchema);

const regenerateInviteCode = oc
  .route({
    method: "POST",
    path: "/league/{leagueId}/invite-code/regenerate",
  })
  .input(GetLeagueSchema)
  .output(InviteCodeSchema);

const updateInviteCode = oc
  .route({
    method: "PATCH",
    path: "/league/{leagueId}/invite-code",
  })
  .input(UpdateInviteCodeSchema)
  .output(InviteCodeSchema);

const listLeagueMembers = oc
  .route({ method: "GET", path: "/league/{leagueId}/member" })
  .input(GetLeagueSchema)
  .output(LeagueMemberSchema.array());

const getLeagueMember = oc
  .route({ method: "GET", path: "/league/{leagueId}/member/{userId}" })
  .input(GetLeagueMemberSchema)
  .output(LeagueMemberSchema);

export const leagueRoutes = {
  list: listLeagues,
  get: getLeague,
  create: createLeague,
  update: updateLeague,
  delete: deleteLeague,
  inviteCode: {
    get: getInviteCode,
    update: updateInviteCode,
    regenerate: regenerateInviteCode,
  },
  member: {
    list: listLeagueMembers,
    get: getLeagueMember,
  },
};
