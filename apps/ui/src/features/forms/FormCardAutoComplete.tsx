import classes from "./styles.module.css";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";
import { CardAutoComplete } from "../common/components/CardAutoComplete";

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

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}
      <CardAutoComplete
        {...field}
        inputStyle={{ width: "100%" }}
        placeholder={placeholder}
        invalid={fieldState.invalid}
        forceSelection
      />
    </div>
  );
}
