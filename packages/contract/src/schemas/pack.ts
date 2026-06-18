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
  cost: z.number().nonnegative(),
});
