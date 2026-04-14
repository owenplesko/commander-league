import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { CardTable } from "../cardTable/Table";
import type { CardQuantity } from "@commander-league/contract/schemas";

type Props = {
  userId: string;
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

export function NewDeck({ userId, leagueId, visible, onHide }: Props) {
  const [name, setName] = useState<string>("");

  const mutation = useMutation(orpc.deck.create.mutationOptions());

  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId },
    }),
  );

  const [selectedCards, setSelectedCards] = useState<CardQuantity[]>([]);

  return (
    <Dialog
      header="New Deck"
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
                cardQuantities: selectedCards.map(({ quantity, card }) => ({
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
            cards={collection.cardQuantities}
            onSelectionChange={setSelectedCards}
            selectedRows={selectedCards}
          />
        </div>
      </div>
    </Dialog>
  );
}
