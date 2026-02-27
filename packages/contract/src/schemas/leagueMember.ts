import z from "zod";
import { GetLeagueSchema } from "./league";
import { UserSchema } from "./user";

export const leagueRoleValues = ["owner", "admin", "player"] as const;

export type LeagueRole = (typeof leagueRoleValues)[number];

export const LeagueMemberSchema = z.object({
  role: z.enum(leagueRoleValues),
  user: UserSchema,
});
export type LeagueMember = z.infer<typeof LeagueMemberSchema>;

export const GetLeagueMemberSchema = GetLeagueSchema.extend({
  userId: UserSchema.shape.id,
});

export type GetLeagueMemberInput = z.infer<typeof GetLeagueMemberSchema>;
