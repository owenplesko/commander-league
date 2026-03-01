import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { InputTextarea } from "primereact/inputtextarea";
import type { Collection } from "@commander-league/contract/schemas";
import { isDefinedError } from "@orpc/client";
import { Message } from "primereact/message";

type Props = {
  collection: Collection;
  userId: string;
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

function marshalCollection(collection: Collection) {
  return collection.cards
    .map(({ card: { name }, quantity }) => `${quantity} ${name}`)
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
        return { quantity: 0, cardName: "" };
      }

      const [, quantityStr, name] = match;

      return {
        quantity: Number(quantityStr),
        cardName: name?.trim() ?? "",
      };
    })
    .filter((entry) => entry.quantity > 0 && entry.cardName.length > 0);
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
      onSuccess: (_output, { userId, leagueId }, _err, ctx) => {
        ctx.client.invalidateQueries({
          queryKey: orpc.collection.get.key({
            input: { leagueId, userId },
          }),
        });
        onHide();
        setCollectionText(undefined);
      },
    }),
  );

  const invalidCards = isDefinedError(mutation.error)
    ? mutation.error.data.invalidCardNames
    : null;

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
        mutation.reset();
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
            autoResize={false}
            rows={20}
            style={{ resize: "none", overflowY: "auto" }}
            value={collectionText}
            onChange={(e) => setCollectionText(e.target.value)}
          />
          {invalidCards && (
            <Message
              severity="error"
              text={`Invalid Cards: "${invalidCards.join('", "')}"`}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
