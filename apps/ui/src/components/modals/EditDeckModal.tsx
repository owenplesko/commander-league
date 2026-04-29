import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

type Props = {
  deckId: number;
  userId: string;
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

export function EditDeck({ deckId, visible, onHide }: Props) {
  const [name, setName] = useState<string>("");

  const mutation = useMutation(orpc.deck.update.mutationOptions());

  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({
      input: { deckId },
    }),
  );

  useEffect(() => {
    if (visible) {
      setName(deck.name);
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
          label="Save"
          onClick={() => {
            mutation.mutate(
              {
                deckId,
                name,
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
      </div>
    </Dialog>
  );
}
