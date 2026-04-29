import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import { orpc, queryClient } from "../../../lib/client";

export function CardAutoComplete({
  collectionId,
  onSelection,
  placeholder = "card name...",
  cardName,
  onChange,
}: {
  collectionId?: number;
  onSelection?: (s: string) => void;
  placeholder?: string;
  cardName: string | undefined;
  onChange: (cardName: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <AutoComplete
      placeholder={placeholder}
      value={cardName}
      onChange={(e) => {
        onChange(e.value);
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
      onSelect={(e) => {
        if (onSelection) onSelection(e.value);
      }}
      forceSelection
    />
  );
}
