import type { CardQuantity } from "@commander-league/contract/schemas";

export function marshalCardQuantities(cardQuantities: CardQuantity[]) {
  return cardQuantities
    .map(({ card: { name }, quantity }) => `${quantity} ${name}`)
    .join("\n");
}

export function unmarshalCardQuantities(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.+)$/);

      if (!match) {
        return { quantity: 0, cardName: "" };
      }

      const [, quantityStr, name] = match;

      return {
        quantity: Number(quantityStr),
        cardName: name?.trim() ?? "",
      };
    })
    .filter((entry) => entry.quantity > 0 && entry.cardName.length > 0);
}
