import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputTextArea } from "@/features/forms/FormInputTextArea";
import { isDefinedError } from "@orpc/client";
import { CardQuantitiesCodec } from "@/features/common/lib/bulkEdit";
import z from "zod";

type Props = {
  userId: string;
  visible: boolean;
  onHide: () => void;
};

type FormData = {
  collectionText: string;
};

export function CollectionBulkEditModal({ userId, visible, onHide }: Props) {
  const mutation = useMutation(orpc.collection.set.mutationOptions());
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { userId } }),
  );

  const { control, handleSubmit, reset, setValue, setError } =
    useForm<FormData>({ mode: "onSubmit" });

  const onSubmit: SubmitHandler<FormData> = async ({ collectionText }) => {
    const cardQuantities = CardQuantitiesCodec.decode(collectionText);

    await mutation.mutateAsync(
      { userId, cardQuantities },
      {
        onError(err) {
          if (isDefinedError(err))
            setError("collectionText", {
              message: `Unknown Cards: ${err.data.invalidCardNames.join(", ")}`,
            });
        },
      },
    );

    onHide();
  };

  useEffect(() => {
    if (visible) {
      reset();
      mutation.reset();
      setValue(
        "collectionText",
        CardQuantitiesCodec.encode(
          collection.cardQuantities.map(({ quantity, card }) => ({
            quantity,
            cardName: card.name,
          })),
        ),
      );
    }
  }, [visible]);

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
          rules={{
            validate: (val) => {
              const { error } = CardQuantitiesCodec.safeDecode(val);
              return error ? z.prettifyError(error) : true;
            },
          }}
        />
      </form>
    </Dialog>
  );
}
