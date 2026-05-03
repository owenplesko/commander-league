import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type { LeagueMember } from "@commander-league/contract/schemas";
import { orpc } from "../../../lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputText } from "../../forms/FormInputText";
import { FormCardAutoComplete } from "../../forms/FormCardAutoComplete";
import { useState } from "react";

type FormData = {
  name: string;
  commanderCardName: string;
  partnerCardName: string | null;
};

type Props = {
  deckId: number;
  leagueMember: LeagueMember;
  visible: boolean;
  onHide: () => void;
};

export function EditDeckModal({
  deckId,
  leagueMember,
  visible,
  onHide,
}: Props) {
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: deck.name,
      commanderCardName: deck.commanderCard.name,
      partnerCardName: deck.partnerCard?.name,
    },
  });

  const mutation = useMutation(orpc.deck.update.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    commanderCardName,
    partnerCardName,
  }) => {
    await mutation.mutateAsync({
      deckId,
      name,
      commanderCardName,
      partnerCardName,
    });
    onHide();
  };

  return (
    <Dialog
      header={`Edit "${deck.name}"`}
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem", margin: "4rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Save" type="submit" form="new-deck" />}
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
          rules={{ required: true, minLength: 3, maxLength: 20 }}
          control={control}
        />
        <FormCardAutoComplete
          name="commanderCardName"
          label="Commander"
          placeholder="card name..."
          collectionId={leagueMember.collectionId}
          rules={{ required: true }}
          control={control}
        />
        <FormCardAutoComplete
          name="partnerCardName"
          label="Partner"
          placeholder="card name..."
          collectionId={leagueMember.collectionId}
          control={control}
        />
      </form>
    </Dialog>
  );
}
