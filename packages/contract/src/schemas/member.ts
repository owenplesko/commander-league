import z from "zod";
import { UserSchema } from "./user";

export const MemberSchema = z.object({
  admin: z.boolean(),
  user: UserSchema,
  collectionId: z.number(),
});
export type Member = z.infer<typeof MemberSchema>;

export const CreateMemberSchema = z.object({
  userId: UserSchema.shape.id,
  admin: z.boolean().optional(),
});

export const GetMemberSchema = z.object({
  userId: UserSchema.shape.id,
});

export type GetMemberInput = z.infer<typeof GetMemberSchema>;
