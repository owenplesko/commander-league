import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";
import { queryClient, orpc } from "../../lib/client";

export function FormCardAutoComplete<T extends FieldValues>({
  collectionId,
  ...controllerProps
}: UseControllerProps<T> & { collectionId?: number }) {
  const { field, fieldState } = useController(controllerProps);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <AutoComplete
      {...field}
      invalid={fieldState.invalid}
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
      forceSelection
    />
  );
}
