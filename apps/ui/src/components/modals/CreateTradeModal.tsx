import type { CollectionCard, User } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UserBadge } from "../UserBadge";
import { useState } from "react";
import type { Card } from "primereact/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "../../lib/client";
import { CardTable } from "../CardTable";
import { scryfallImgUrl } from "../../lib/utils";

type Props = {
  leagueId: number;
  requester: User;
  recipient: User;
  visible: boolean;
  onHide: () => void;
};

export function CreateTradeRequestModal({
  leagueId,
  requester,
  recipient,
  visible,
  onHide,
}: Props) {
  const { data: requesterCollection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId: requester.id },
    }),
  );
  const { data: recipientCollection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId: recipient.id },
    }),
  );

  const [requesterItems, setRequesterItems] = useState<CollectionCard[]>([]);
  const [recipientItems, setRecipientItems] = useState<CollectionCard[]>([]);

  return (
    <Dialog
      header="Trade Request"
      visible={visible}
      onHide={() => {
        onHide();
      }}
      style={{ width: "100%", maxWidth: "1600px", margin: "4rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Request" onClick={() => {}} />}
    >
      <div className="form" style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            placeItems: "center",
          }}
        >
          <UserBadge user={requester} />
          {recipient && <UserBadge user={recipient} />}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {requesterItems.map((item) => (
            <img
              width={120}
              src={scryfallImgUrl(
                item.card.data.printings[0]?.scryfallId ?? null,
              )}
            />
          ))}
          <i className="pi pi-arrow-right-arrow-left" />
        </div>
        <div style={{ overflow: "auto", maxHeight: "30rem" }}>
          <CardTable
            cards={requesterCollection.cards}
            onRowSelect={(cardEntry) =>
              setRequesterItems((previous) => [...previous, cardEntry])
            }
          />
        </div>
      </div>
    </Dialog>
  );
}
