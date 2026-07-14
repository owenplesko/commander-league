import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { MultiSelect, type MultiSelectProps } from "primereact/multiselect";

import classes from "./styles.module.css";

type FormMultiSelectProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<MultiSelectProps, "value" | "onChange"> & {
    label?: string;
  };

export function FormMultiSelect<T extends FieldValues>({
  label,
  ...props
}: FormMultiSelectProps<T>) {
  const { name, control, rules, defaultValue, disabled, shouldUnregister } =
    props;

  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
  });

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}

      <MultiSelect
        {...props}
        inputId={field.name}
        value={field.value ?? []}
        onChange={(e) => field.onChange(e.value)}
        onBlur={field.onBlur}
        invalid={fieldState.invalid}
      />

      {fieldState.error && (
        <small className={classes.error}>{fieldState.error.message}</small>
      )}
    </div>
  );
}
