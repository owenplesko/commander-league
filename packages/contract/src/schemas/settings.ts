import z from "zod";
import { UserSchema } from "./user";

export const SettingsSchema = z.object({
  ownerId: UserSchema.shape.id,
  leagueName: z.string(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const UpdateSettingsSchema = z.object({
  leagueName: z.string().optional(),
});
