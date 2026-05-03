import { InputText } from "primereact/inputtext";
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";

export function FormInputText<T extends FieldValues>(
  controllerProps: UseControllerProps<T>,
) {
  const { field, fieldState } = useController(controllerProps);

  return <InputText {...field} invalid={fieldState.invalid} />;
}
