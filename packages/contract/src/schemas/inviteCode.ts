import z from "zod";
import { GetLeagueSchema, LeagueSchema } from "./league";

export const InviteCodeSchema = z.object({
  leagueId: LeagueSchema.shape.id,
  code: z.string(),
  active: z.boolean(),
  uses: z.number(),
});

export type InviteCode = z.infer<typeof InviteCodeSchema>;

export const GetInviteCodeSchema = GetLeagueSchema.extend(
  InviteCodeSchema.pick({
    code: true,
  }).shape,
);

export const JoinLeagueSchema = z.object({
  inviteCode: InviteCodeSchema.shape.code,
});

export const UpdateInviteCodeSchema = InviteCodeSchema.pick({
  active: true,
});
