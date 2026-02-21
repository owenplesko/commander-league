import z from "zod";
import { LeagueSchema } from "./league";
import { UserSchema } from "./user";

export const LeagueMemberSchema = z.object({
  role: z.string(),
  user: UserSchema,
});
export type LeagueMember = z.infer<typeof LeagueMemberSchema>;

export const GetLeagueMemberSchema = z.object({
  leagueId: LeagueSchema.shape.id,
  userId: UserSchema.shape.id,
});
