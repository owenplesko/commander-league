import { orpc } from "../../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { FormCardAutoComplete } from "../../forms/FormCardAutoComplete";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "primereact/button";

type FormData = {
  cardName: string;
};

export function AddDeckCard({
  deckId,
}: {
  deckId: number;
  collectionId: number;
}) {
  const { control, handleSubmit, reset } = useForm<FormData>();

  const mutation = useMutation(orpc.deck.updateCards.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = ({ cardName }) => {
    mutation.mutate({ deckId, cardDeltas: [{ cardName, quantity: 1 }] });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCardAutoComplete name="cardName" control={control} />
      <Button label="Add" type="submit" />
    </form>
  );
}
