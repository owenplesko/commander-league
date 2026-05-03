import classes from "./styles.module.css";
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
  label,
  placeholder,
  ...controllerProps
}: UseControllerProps<T> & {
  collectionId?: number;
  label?: string;
  placeholder?: string;
}) {
  const { field, fieldState } = useController(controllerProps);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}
      <AutoComplete
        inputStyle={{ width: "100%" }}
        {...field}
        placeholder={placeholder}
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
    </div>
  );
}
