import { orpc } from "../../../lib/client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CardAutoComplete } from "./CardAutoComplete";

export function AddDeckCard({
  deckId,
  collectionId,
}: {
  deckId: number;
  collectionId: number;
}) {
  const [cardName, setCardName] = useState<string | undefined>(undefined);

  const mutation = useMutation(orpc.deck.updateCards.mutationOptions());

  function onSelection(cardName: string) {
    mutation.mutate({ deckId, cardDeltas: [{ cardName, quantity: 1 }] });
    setCardName(undefined);
  }

  return (
    <CardAutoComplete
      cardName={cardName}
      onChange={setCardName}
      onSelection={onSelection}
      collectionId={collectionId}
      placeholder="add card..."
    />
  );
}
