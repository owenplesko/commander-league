import z from "zod";

export const InviteCodeSchema = z.object({
  leagueId: z.number(),
  code: z.string().nullable(),
  active: z.boolean(),
  uses: z.number(),
});

export type InviteCode = z.infer<typeof InviteCodeSchema>;

export const UpdateInviteCodeSchema = InviteCodeSchema.pick({
  leagueId: true,
  active: true,
});
