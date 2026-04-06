import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { CardTable } from "../cardTable/Table";
import type { SelectedCard } from "../cardTable/selection";

type Props = {
  deckId: number;
  userId: string;
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

export function NewDeck({ deckId, userId, leagueId, visible, onHide }: Props) {
  const [name, setName] = useState<string>("");

  const mutation = useMutation(orpc.deck.create.mutationOptions());

  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId },
    }),
  );
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({
      input: { deckId },
    }),
  );

  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectedCards(deck.cards);
    }
  }, [visible]);

  return (
    <Dialog
      header="Edit Deck"
      visible={visible}
      onHide={onHide}
      style={{ width: "100%", maxWidth: "1600px", margin: "4rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={
        <Button
          label="Create"
          onClick={() => {
            mutation.mutate(
              {
                leagueId,
                name,
                displayCardName: null,
                cards: selectedCards.map(({ quantity, card }) => ({
                  quantity,
                  cardName: card.name,
                })),
              },
              { onSuccess: onHide },
            );
          }}
        />
      }
    >
      <div className="form">
        <div className="field">
          <label>Deck Name</label>
          <InputText
            placeholder="name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ overflow: "auto", maxHeight: "30rem" }}>
          <CardTable
            cards={collection.cards}
            onSelectionChange={setSelectedCards}
            selectedRows={selectedCards}
          />
        </div>
      </div>
    </Dialog>
  );
}
