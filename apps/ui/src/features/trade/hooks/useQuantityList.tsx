import { useState } from "react";
import type { CreateCardQuantity } from "@commander-league/contract/schemas";

export function useCardQuantityList() {
  const [cards, setCards] = useState<CreateCardQuantity[]>([]);

  function applyDelta({ cardName, quantity }: CreateCardQuantity) {
    setCards((prev) => {
      const existing = prev.find((c) => c.cardName === cardName);

      if (!existing) {
        return [...prev, { cardName, quantity }];
      }

      const newQuantity = existing.quantity + quantity;

      if (newQuantity <= 0) {
        return prev.filter((c) => c.cardName !== cardName);
      }

      return prev.map((c) =>
        c.cardName === cardName ? { ...c, quantity: newQuantity } : c,
      );
    });
  }

  return { cards, applyDelta };
}
