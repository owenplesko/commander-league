import z from "zod";

export const InviteCodeSchema = z.object({
  leagueId: z.number(),
  code: z.string(),
  active: z.boolean(),
  uses: z.number(),
});

export type InviteCode = z.infer<typeof InviteCodeSchema>;

export const GetInviteCodeSchema = InviteCodeSchema.pick({
  leagueId: true,
  code: true,
});

export const UpdateInviteCodeSchema = GetInviteCodeSchema.extend(
  InviteCodeSchema.pick({ active: true }).shape,
);
