import z from "zod";
import { LeagueSchema } from "./league";

export const InviteCodeSchema = z.object({
  leagueId: LeagueSchema.shape.id,
  code: z.string(),
  active: z.boolean(),
  uses: z.number(),
});

export type InviteCode = z.infer<typeof InviteCodeSchema>;

export const GetInviteCodeSchema = InviteCodeSchema.pick({
  leagueId: true,
  code: true,
});

export const JoinLeagueSchema = z.object({
  inviteCode: InviteCodeSchema.shape.code,
});

export const UpdateInviteCodeSchema = GetInviteCodeSchema.extend(
  InviteCodeSchema.pick({ active: true }).shape,
);
