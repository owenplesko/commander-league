import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { InputTextarea } from "primereact/inputtextarea";
import type { Collection } from "@commander-league/contract/schemas";

type Props = {
  collection: Collection;
  userId: string;
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

function marshalCollection(collection: Collection) {
  return collection.cards
    .map(({ name, quantity }) => `${quantity} ${name}`)
    .join("\n");
}

function unmarshalCollection(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.+)$/);

      if (!match) {
        return { quantity: 0, name: "" };
      }

      const [, quantityStr, name] = match;

      return {
        quantity: Number(quantityStr),
        name: name?.trim() ?? "",
      };
    })
    .filter((entry) => entry.quantity > 0 && entry.name.length > 0);
}

export function CollectionBulkEditModal({
  collection,
  userId,
  leagueId,
  visible,
  onHide,
}: Props) {
  const mutation = useMutation(
    orpc.collection.set.mutationOptions({
      onSuccess: () => {
        onHide();
        setCollectionText(undefined);
      },
    }),
  );

  const [collectionText, setCollectionText] = useState<string>();

  useEffect(() => {
    if (visible) setCollectionText(marshalCollection(collection));
  }, [visible]);

  return (
    <Dialog
      header="Bulk Edit"
      visible={visible}
      onHide={() => {
        onHide();
        setCollectionText(undefined);
      }}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={
        <Button
          label="Save"
          onClick={() => {
            const cards = unmarshalCollection(collectionText ?? "");
            mutation.mutate({ leagueId, userId, cards });
          }}
        />
      }
    >
      <div className="form">
        <div className="field">
          <label>Collection</label>
          <InputTextarea
            invalid={!!mutation.error}
            autoResize={true}
            rows={10}
            value={collectionText}
            onChange={(e) => setCollectionText(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
