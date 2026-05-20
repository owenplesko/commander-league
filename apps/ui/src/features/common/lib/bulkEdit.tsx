import {
  CreateCardQuantitySchema,
  type CreateCardQuantity,
} from "@commander-league/contract/schemas";
import z from "zod";

export const CardQuantitiesCodec = z.codec(
  z.string(),
  CreateCardQuantitySchema.array(),
  {
    encode(cardQuantities: CreateCardQuantity[]) {
      return cardQuantities
        .map(({ cardName, quantity }) => `${quantity} ${cardName}`)
        .join("\n");
    },
    decode(input: string, ctx) {
      const lines = input.trim().split("\n").filter(Boolean);
      const results: CreateCardQuantity[] = [];

      for (const line of lines) {
        const match = line.match(/^(\d+)\s+(.+?)(?:\s+\((\w+)\)\s+(\S+).*)?$/);
        if (!match) {
          ctx.issues.push({
            code: "custom",
            message: `Failed to parse line: "${line}"`,
            input,
          });
          continue;
        }
        const [, quantity, rawName] = match;
        if (!quantity || !rawName) {
          ctx.issues.push({
            code: "custom",
            message: `Failed to parse line: "${line}"`,
            input,
          });
          continue;
        }
        const cardName = rawName.replace(/(?<!\/)\s*\/\s*(?!\/)/g, " // ");
        results.push({ quantity: parseInt(quantity, 10), cardName });
      }

      return results;
    },
  },
);
