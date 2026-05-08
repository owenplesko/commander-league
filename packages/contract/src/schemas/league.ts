import { z } from "zod";
import { UserSchema } from "./user";

export const LeagueSchema = z.discriminatedUnion("initialized", [
  z.object({
    initialized: z.literal(true),
    settings: z.object({
      ownerId: UserSchema.shape.id,
      name: z.string(),
    }),
  }),
  z.object({
    initialized: z.literal(false),
  }),
]);

export const InitializeLeagueSchema = z.object({ name: z.string() });

export type League = z.infer<typeof LeagueSchema>;
