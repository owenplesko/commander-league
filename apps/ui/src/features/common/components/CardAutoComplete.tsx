import { AutoComplete, type AutoCompleteProps } from "primereact/autocomplete";
import { useState } from "react";
import { queryClient, orpc } from "../../../lib/client";
import type { Card } from "@commander-league/contract/schemas";
import { HoverCard } from "./HoverCard";

export function CardAutoComplete({
  collectionId,
  onSelect,
  ...defautlProps
}: AutoCompleteProps & {
  collectionId?: number;
}) {
  const [suggestions, setSuggestions] = useState<Card[]>([]);
  const [hoverCard, setHoverCard] = useState<Card>();

  function itemTemplate(card: Card) {
    return (
      <div
        onMouseEnter={() => setHoverCard(card)}
        onMouseLeave={() => setHoverCard(undefined)}
        style={{ padding: "0.75rem 1.25rem" }}
      >
        {card.name}
      </div>
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
        onSelect={(e) => {
          setHoverCard(undefined);
          if (onSelect) onSelect(e);
        }}
      />
      <HoverCard card={hoverCard} />
    </>
  );
}
