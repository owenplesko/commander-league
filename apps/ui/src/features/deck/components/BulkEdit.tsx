import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputTextArea } from "@/features/forms/FormInputTextArea";
import { isDefinedError } from "@orpc/client";
import { Message } from "primereact/message";
import {
  marshalCardQuantities,
  unmarshalCardQuantities,
} from "@/features/common/lib/bulkEdit";

type Props = {
  deckId: number;
  visible: boolean;
  onHide: () => void;
};

type FormData = {
  collectionText: string;
};

export function DeckBulkEditModal({ deckId, visible, onHide }: Props) {
  const mutation = useMutation(orpc.deck.setCards.mutationOptions());
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );

  const { control, handleSubmit, reset, setValue } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ collectionText }) => {
    const cardQuantities = unmarshalCardQuantities(collectionText);

    await mutation.mutateAsync({ deckId, cardQuantities });
    onHide();
  };

  useEffect(() => {
    if (visible) {
      reset();
      mutation.reset();
      setValue("collectionText", marshalCardQuantities(deck.cardQuantities));
    }
  }, [visible]);

  const invalidCards = isDefinedError(mutation.error)
    ? mutation.error.data.invalidCardNames
    : null;

  return (
    <Dialog
      header="Bulk Edit"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Save" type="submit" form="bulk-edit" />}
    >
      <form
        id="bulk-edit"
        className="modalForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputTextArea
          control={control}
          label="Cards"
          name="collectionText"
        />
        {invalidCards && (
          <Message
            severity="error"
            text={`Invalid Cards: "${invalidCards.join('", "')}"`}
          />
        )}
      </form>
    </Dialog>
  );
}
