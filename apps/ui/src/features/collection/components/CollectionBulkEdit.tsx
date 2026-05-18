import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type { CardQuantity } from "@commander-league/contract/schemas";
import { orpc } from "@/lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputTextArea } from "@/features/forms/FormInputTextArea";
import { isDefinedError } from "@orpc/client";
import { Message } from "primereact/message";

type Props = {
  userId: string;
  visible: boolean;
  onHide: () => void;
};

function marshalCollection(cardQuantities: CardQuantity[]) {
  return cardQuantities
    .map(({ card: { name }, quantity }) => `${quantity} ${name}`)
    .join("\n");
}

function unmarshalCollection(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.+)$/);

      if (!match) {
        return { quantity: 0, cardName: "" };
      }

      const [, quantityStr, name] = match;

      return {
        quantity: Number(quantityStr),
        cardName: name?.trim() ?? "",
      };
    })
    .filter((entry) => entry.quantity > 0 && entry.cardName.length > 0);
}

type FormData = {
  collectionText: string;
};

export function CollectionBulkEditModal({ userId, visible, onHide }: Props) {
  const mutation = useMutation(orpc.collection.set.mutationOptions());
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { userId } }),
  );

  const { control, handleSubmit, reset, setValue } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ collectionText }) => {
    const cardQuantities = unmarshalCollection(collectionText);

    await mutation.mutateAsync({ userId, cardQuantities });
    onHide();
  };

  useEffect(() => {
    if (visible) {
      reset();
      mutation.reset();
      setValue("collectionText", marshalCollection(collection.cardQuantities));
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
