import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";

type Props = {
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

export function NewDeck({ leagueId, visible, onHide }: Props) {
  const [name, setName] = useState<string>("");

  const mutation = useMutation(orpc.deck.create.mutationOptions());

  return (
    <Dialog
      header="New Deck"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={
        <Button
          label="Create"
          onClick={() => {
            mutation.mutate(
              { leagueId, name, displayCardName: null },
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
