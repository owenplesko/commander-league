import classes from "./styles.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";

export function FormInputTextArea<T extends FieldValues>({
  label,
  placeholder,
  ...controllerProps
}: UseControllerProps<T> & { label?: string; placeholder?: string }) {
  const { field, fieldState } = useController(controllerProps);

  return (
    <div className={classes.field}>
      {label && <label htmlFor={field.name}>{label}</label>}
      <InputTextarea
        {...field}
        autoResize={true}
        placeholder={placeholder}
        invalid={fieldState.invalid}
      />
    </div>
  );
}
