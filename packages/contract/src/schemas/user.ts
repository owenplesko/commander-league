import z, { boolean } from "zod";

export const GetUserParams = z.object({
  isMember: boolean().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
