import { orpc } from "../../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { FormCardAutoComplete } from "../../forms/FormCardAutoComplete";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "primereact/button";
import type { Card } from "@commander-league/contract/schemas";

type FormData = {
  card: Card;
};

export function AddDeckCard({
  deckId,
  collectionId,
}: {
  deckId: number;
  collectionId: number;
}) {
  const { control, handleSubmit, reset } = useForm<FormData>();

  const mutation = useMutation(orpc.deck.updateCards.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = ({ card }) => {
    mutation.mutate({
      deckId,
      cardDeltas: [{ cardName: card.name, quantity: 1 }],
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", width: "100rem", gap: "0.5rem" }}
    >
      <FormCardAutoComplete
        name="card"
        placeholder="add card..."
        control={control}
        rules={{ required: true }}
        collectionId={collectionId}
      />
      <Button label="Add" type="submit" />
    </form>
  );
}
