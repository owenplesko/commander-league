import { orpc } from "../../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { useController, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "primereact/button";
import type { Card } from "@commander-league/contract/schemas";
import { CardAutoComplete } from "@/features/common/components/CardAutoComplete";
import { PrimeIcons } from "primereact/api";

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
  const { field } = useController({ control, name: "card" });

  const mutation = useMutation(orpc.deck.updateCards.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = ({ card }) => {
    mutation.mutate({
      deckId,
      cardDeltas: [{ cardName: card.name, quantity: 1 }],
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-inputgroup">
        <CardAutoComplete
          {...field}
          collectionId={collectionId}
          forceSelection
          placeholder="add card..."
        />
        <Button icon={PrimeIcons.PLUS} type="submit" outlined />
      </div>
    </form>
  );
}
