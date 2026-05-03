import classes from "./styles.module.css";
import { InputText } from "primereact/inputtext";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";

export function FormInputText<T extends FieldValues>({
  label,
  placeholder,
  ...controllerProps
}: UseControllerProps<T> & { label?: string; placeholder?: string }) {
  const { field, fieldState } = useController(controllerProps);

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}
      <InputText
        {...field}
        placeholder={placeholder}
        invalid={fieldState.invalid}
      />
    </div>
  );
}
