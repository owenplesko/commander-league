import z from "zod";

export const PackSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const PackOfferingSchema = z.object({
  cost: z.number().nonnegative(),
  pack: PackSchema,
});

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
