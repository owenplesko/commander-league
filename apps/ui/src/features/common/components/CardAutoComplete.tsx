import { AutoComplete, type AutoCompleteProps } from "primereact/autocomplete";
import { useState } from "react";
import { queryClient, orpc } from "../../../lib/client";

export function CardAutoComplete({
  collectionId,
  ...defautlProps
}: AutoCompleteProps & {
  collectionId?: number;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <AutoComplete
      {...defautlProps}
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
