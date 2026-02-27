import z from "zod";

export const LeagueSchema = z.object({
  id: z.coerce.number<number>(),
  name: z.string().min(3).max(50),
});

export type League = z.infer<typeof LeagueSchema>;

export const GetLeagueSchema = z.object({ leagueId: LeagueSchema.shape.id });
export type GetLeagueInput = z.infer<typeof GetLeagueSchema>;

export const CreateLeagueSchema = LeagueSchema.omit({ id: true });

export const UpdateLeagueSchema = LeagueSchema.omit({ id: true }).partial();
