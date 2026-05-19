import type { Deck } from "@commander-league/contract/schemas";

export function marshalDeck(deck: Deck) {
  const txt = `
    Commander
    1 ${deck.commanderCard.name}
    ${deck.partnerCard ? `1 ${deck.partnerCard.name}` : ""}

    Deck
    ${deck.cardQuantities.map(({ quantity, card: { name } }) => `${quantity} ${name}`).join("\n")}
  `;

  return txt;
}
