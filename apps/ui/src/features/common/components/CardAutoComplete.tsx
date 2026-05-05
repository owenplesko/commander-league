import { AutoComplete, type AutoCompleteProps } from "primereact/autocomplete";
import { useState } from "react";
import { queryClient, orpc } from "../../../lib/client";
import type { Card } from "@commander-league/contract/schemas";
import { HoverCard } from "./HoverCard";

export function CardAutoComplete({
  collectionId,
  ...defautlProps
}: AutoCompleteProps & {
  collectionId?: number;
}) {
  const [suggestions, setSuggestions] = useState<Card[]>([]);

  function itemTemplate(card: Card) {
    return (
      <HoverCard card={card}>
        <div style={{ padding: "0.75rem 1.25rem" }}>{card.name}</div>
      </HoverCard>
    );
  }

  return (
    <>
      <AutoComplete
        pt={{
          item: {
            style: {
              padding: 0,
            },
          },
        }}
        {...defautlProps}
        field="name"
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
    </>
  );
}
