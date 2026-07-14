import z from "zod";
import { UserSchema } from "./user";

export const MemberSchema = z.object({
  admin: z.boolean(),
  user: UserSchema,
  packPoints: z.number(),
  collectionId: z.number(),
});
export type Member = z.infer<typeof MemberSchema>;

export const CreateMemberSchema = z.object({
  userId: UserSchema.shape.id,
});

export const GetMemberSchema = z.object({
  userId: UserSchema.shape.id,
});

export const IncrementPackPointSchema = z.object({
  userIds: z.string().array().optional(),
  increment: z.number(),
});

export type GetMemberInput = z.infer<typeof GetMemberSchema>;
