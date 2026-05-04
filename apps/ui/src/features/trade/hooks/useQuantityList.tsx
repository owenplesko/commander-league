import { useState } from "react";
import type { CardQuantity } from "@commander-league/contract/schemas";

export function useCardQuantityList() {
  const [cards, setCards] = useState<CardQuantity[]>([]);
  const createCards = cards.map(({ card, quantity }) => ({
    cardName: card.name,
    quantity,
  }));

  function applyDelta(cq: CardQuantity) {
    setCards((prev) => {
      const existing = prev.find((c) => c.card.name === cq.card.name);

      if (!existing) {
        return [...prev, cq];
      }

      const newQuantity = existing.quantity + cq.quantity;

      if (newQuantity <= 0) {
        return prev.filter((c) => c.card.name !== cq.card.name);
      }

      return prev.map((c) =>
        c.card.name === cq.card.name ? { ...c, quantity: newQuantity } : c,
      );
    });
  }

  return { cards, createCards, applyDelta };
}
