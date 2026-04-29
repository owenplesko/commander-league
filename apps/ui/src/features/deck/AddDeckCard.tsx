import { AutoComplete } from "primereact/autocomplete";
import { queryClient, orpc } from "../../lib/client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export function AddDeckCard({
  deckId,
  collectionId,
}: {
  deckId: number;
  collectionId: number;
}) {
  const [cardName, setCardName] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const mutation = useMutation(orpc.deck.updateCards.mutationOptions());

  function onSelect(cardName: string) {
    mutation.mutate({ deckId, cardDeltas: [{ cardName, quantity: 1 }] });
    setCardName(undefined);
  }

  return (
    <AutoComplete
      placeholder="add cards..."
      value={cardName}
      onChange={(e) => {
        setCardName(e.value);
      }}
      suggestions={suggestions}
      completeMethod={async (e) => {
        const res = await queryClient.fetchQuery(
          orpc.card.search.queryOptions({
            input: {
              cardName: e.query,
              collectionId: collectionId,
            },
          }),
        );

        setSuggestions(res);
      }}
      onSelect={(e) => onSelect(e.value)}
      forceSelection
    />
  );
}
