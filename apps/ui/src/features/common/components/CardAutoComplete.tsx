import { AutoComplete, type AutoCompleteProps } from "primereact/autocomplete";
import { useState } from "react";
import { queryClient, orpc } from "../../../lib/client";
import type { Card } from "@commander-league/contract/schemas";

function itemTemplate(card: Card) {
  return <span>{card.name}</span>;
}

export function CardAutoComplete({
  collectionId,
  ...defautlProps
}: AutoCompleteProps & {
  collectionId?: number;
}) {
  const [suggestions, setSuggestions] = useState<Card[]>([]);

  return (
    <AutoComplete
      {...defautlProps}
      itemTemplate={itemTemplate}
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
    />
  );
}
