import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../../../lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputText } from "../../forms/FormInputText";

type FormData = {
  name: string;
};

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function NewLeagueModal({ visible, onHide }: Props) {
  const { control, handleSubmit } = useForm<FormData>();

  const mutation = useMutation(orpc.league.create.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    await mutation.mutateAsync({ name });
    onHide();
  };

  return (
    <Dialog
      header="New League"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Create" type="submit" form="new-league" />}
    >
      <form
        className="modaForm"
        id="new-league"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputText
          name="name"
          label="Name"
          placeholder="league name..."
          rules={{ required: true, minLength: 3, maxLength: 20 }}
          control={control}
        />
      </form>
    </Dialog>
  );
}
