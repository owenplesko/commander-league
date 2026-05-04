import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@tanstack/react-query";
import { isDefinedError } from "@orpc/client";
import { Message } from "primereact/message";
import { orpc } from "../../../lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputText } from "../../forms/FormInputText";

type FormData = {
  inviteCode: string;
};

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function JoinLeagueModal({ visible, onHide }: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>();

  const mutation = useMutation(orpc.league.join.mutationOptions());

  const notFound =
    !!mutation.error &&
    isDefinedError(mutation.error) &&
    mutation.error.code === "NOT_FOUND";

  const onSubmit: SubmitHandler<FormData> = async ({ inviteCode }) => {
    await mutation.mutateAsync({ inviteCode });
    onHide();
    reset();
  };

  return (
    <Dialog
      header="Join League"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Join" form="join-league" type="submit" />}
    >
      <form
        className="modalForm"
        id="join-league"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputText
          name="inviteCode"
          label="Invite Code"
          placeholder="invite code..."
          rules={{ required: true, minLength: 3, maxLength: 20 }}
          control={control}
        />
        {notFound && <Message severity="error" text="Invite code invalid" />}
      </form>
    </Dialog>
  );
}
