import z from "zod";
import { CardQuantitySchema } from "./collection";
import { MemberSchema } from "./member";

export const PackSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const PackOfferingSchema = z.object({
  cost: z.number().nonnegative(),
  pack: PackSchema,
});
export type PackOffering = z.infer<typeof PackOfferingSchema>;

export const GetPackSchema = z.object({
  packId: z.string(),
});

export const CreatePackOfferingSchema = z.object({
  packId: z.string(),
  cost: z.coerce.number<number>().nonnegative(),
});

export const PackResolutionSchema = z.object({
  unknown: z.string().array(),
});
export type PackResolution = z.infer<typeof PackResolutionSchema>;

export const PackOpeningSchema = z.object({
  member: MemberSchema,
  packOffering: PackOfferingSchema,
  contents: CardQuantitySchema.array(),
});

export type PackOpening = z.infer<typeof PackOpeningSchema>;
