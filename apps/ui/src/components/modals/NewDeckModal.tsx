import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc, queryClient } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";
import type { LeagueMember } from "@commander-league/contract/schemas";
import { AutoComplete } from "primereact/autocomplete";

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

  const [suggestions, setSuggestions] = useState<string[]>([]);
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
          <AutoComplete
            placeholder="commander..."
            value={commanderName}
            onChange={(e) => setCommanderName(e.value)}
            suggestions={suggestions}
            completeMethod={async (e) => {
              const res = await queryClient.fetchQuery(
                orpc.card.search.queryOptions({
                  input: {
                    cardName: e.query,
                    collectionId: leagueMember.collectionId,
                  },
                }),
              );

              setSuggestions(res);
            }}
            forceSelection
          />
        </div>
        <div className="field">
          <label>Commander</label>
          <AutoComplete
            placeholder="partner..."
            value={partnerName}
            onChange={(e) => setPartnerName(e.value)}
            suggestions={suggestions}
            completeMethod={async (e) => {
              const res = await queryClient.fetchQuery(
                orpc.card.search.queryOptions({
                  input: {
                    cardName: e.query,
                    collectionId: leagueMember.collectionId,
                  },
                }),
              );

              setSuggestions(res);
            }}
            forceSelection
          />
        </div>
      </div>
    </Dialog>
  );
}
