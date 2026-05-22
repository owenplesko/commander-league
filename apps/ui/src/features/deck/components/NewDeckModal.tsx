import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@tanstack/react-query";
import type { Card, Member } from "@commander-league/contract/schemas";
import { orpc } from "../../../lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputText } from "../../forms/FormInputText";
import { FormCardAutoComplete } from "../../forms/FormCardAutoComplete";

type FormData = {
  name: string;
  commander: Card;
  partner: Card | null;
};

type Props = {
  member: Member;
  visible: boolean;
  onHide: () => void;
};

export function NewDeck({ member, visible, onHide }: Props) {
  const { control, handleSubmit } = useForm<FormData>();

  const mutation = useMutation(orpc.deck.create.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    commander,
    partner,
  }) => {
    await mutation.mutateAsync({
      name,
      commanderCardName: commander.name,
      partnerCardName: partner?.name,
    });
    onHide();
  };

  return (
    <Dialog
      header="New Deck"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem", margin: "4rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Create" type="submit" form="new-deck" />}
    >
      <form
        id="new-deck"
        className="modalForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputText
          name="name"
          label="Name"
          placeholder="name..."
          rules={{ required: true, minLength: 3, maxLength: 100 }}
          control={control}
        />
        <FormCardAutoComplete
          name="commander"
          label="Commander"
          placeholder="card name..."
          collectionId={member.collectionId}
          rules={{ required: true }}
          control={control}
        />
        <FormCardAutoComplete
          name="partner"
          label="Partner"
          placeholder="card name..."
          collectionId={member.collectionId}
          control={control}
        />
      </form>
    </Dialog>
  );
}
