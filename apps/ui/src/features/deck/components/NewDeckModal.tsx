import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { LeagueMember } from "@commander-league/contract/schemas";
import { orpc } from "../../../lib/client";
import { CardAutoComplete } from "./CardAutoComplete";

type Props = {
  leagueId: number;
  leagueMember: LeagueMember;
  visible: boolean;
  onHide: () => void;
};

export function NewDeck({ leagueId, leagueMember, visible, onHide }: Props) {
  const [name, setName] = useState<string>("");
  const [commanderName, setCommanderName] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");

  const mutation = useMutation(orpc.deck.create.mutationOptions());

  const onCreate = async () => {
    await mutation.mutateAsync({
      leagueId,
      name,
      commanderCardName: commanderName,
      partnerCardName: partnerName || undefined,
    });
    onHide();
  };

  return (
    <Dialog
      header="New Deck"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem", margin: "4rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Create" onClick={onCreate} />}
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
        <div className="field">
          <label>Commander</label>
          <CardAutoComplete
            cardName={commanderName}
            onChange={setCommanderName}
            collectionId={leagueMember.collectionId}
          />
        </div>
        <div className="field">
          <label>Partner</label>
          <CardAutoComplete
            cardName={partnerName}
            onChange={setPartnerName}
            collectionId={leagueMember.collectionId}
          />
        </div>
      </div>
    </Dialog>
  );
}
