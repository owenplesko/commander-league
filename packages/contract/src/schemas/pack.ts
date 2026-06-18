import z from "zod";

export const GetPackSchema = z.object({
  packId: z.string(),
});

export const CreatePackOfferingSchema = z.object({
  packId: z.string(),
  cost: z.number().nonnegative(),
});
