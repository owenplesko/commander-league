import { InputNumber } from "primereact/inputnumber";
import classes from "./styles.module.css";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";

export function FormInputNumber<T extends FieldValues>({
  label,
  placeholder,
  ...controllerProps
}: UseControllerProps<T> & {
  label?: string;
  placeholder?: string;
}) {
  const { field, fieldState } = useController(controllerProps);

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}

      <InputNumber
        inputId={field.name}
        inputRef={field.ref}
        value={field.value}
        onValueChange={(e) => field.onChange(e.value)}
        onBlur={field.onBlur}
        placeholder={placeholder}
        invalid={fieldState.invalid}
      />
    </div>
  );
}
