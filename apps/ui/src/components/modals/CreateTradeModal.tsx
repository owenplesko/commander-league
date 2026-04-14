import type { CardQuantity, User } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "../../lib/client";
import { TabPanel, TabView } from "primereact/tabview";
import { CardTable } from "../cardTable/Table";
import { TradeItemsPreview } from "../TradePreview";
import { UserBadge } from "../UserBadge";

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

  const [requesterCards, setRequesterCards] = useState<CardQuantity[]>([]);
  const [recipientCards, setRecipientCards] = useState<CardQuantity[]>([]);

  const mutation = useMutation(orpc.trade.create.mutationOptions());

  async function onSubmit() {
    await mutation.mutateAsync({
      leagueId,
      sides: [
        {
          userId: requester.id,
          cardQuantites: requesterCards.map((entry) => ({
            cardName: entry.card.name,
            quantity: entry.quantity,
          })),
        },
        {
          userId: recipient.id,
          cardQuantites: recipientCards.map((entry) => ({
            cardName: entry.card.name,
            quantity: entry.quantity,
          })),
        },
      ],
    });
    onHide();
    setRequesterCards([]);
    setRecipientCards([]);
  }

  useEffect(() => {
    if (visible) {
      setRequesterCards([]);
      setRecipientCards([]);
    }
  }, [visible]);

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
      footer={<Button label="Request" onClick={onSubmit} />}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <UserBadge user={requester} />
        <UserBadge user={recipient} />
      </div>
      <TradeItemsPreview
        requesterItems={{ cardQuantities: requesterCards }}
        recipientItems={{ cardQuantities: recipientCards }}
      />
      <TabView>
        <TabPanel header={requester.name}>
          <div style={{ overflow: "auto", maxHeight: "30rem" }}>
            <CardTable
              cards={requesterCollection.cardQuantities}
              onSelectionChange={setRequesterCards}
              selectedRows={requesterCards}
            />
          </div>
        </TabPanel>
        <TabPanel header={recipient.name}>
          <div style={{ overflow: "auto", maxHeight: "30rem" }}>
            <CardTable
              cards={recipientCollection.cardQuantities}
              onSelectionChange={setRecipientCards}
              selectedRows={recipientCards}
            />
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}
