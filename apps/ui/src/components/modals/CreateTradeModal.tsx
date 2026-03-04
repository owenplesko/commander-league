import type { User } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "../../lib/client";
import { TabPanel, TabView } from "primereact/tabview";
import type { SelectedCard } from "../cardTable/selection";
import { CardTable } from "../cardTable/Table";
import { TradePreview } from "../TradePreview";

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

  const [requesterCards, setRequesterCards] = useState<SelectedCard[]>([]);
  const [recipientCards, setRecipientCards] = useState<SelectedCard[]>([]);

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
      <TradePreview
        tradeRequest={buildTradeRequest({
          requester,
          recipient,
          recipientCards,
          requesterCards,
        })}
      />
      <TabView>
        <TabPanel header={requester.name}>
          <div style={{ overflow: "auto", maxHeight: "30rem" }}>
            <CardTable
              cards={requesterCollection.cards}
              onSelectionChange={setRequesterCards}
              selectedRows={requesterCards}
            />
          </div>
        </TabPanel>
        <TabPanel header={recipient.name}>
          <div style={{ overflow: "auto", maxHeight: "30rem" }}>
            <CardTable
              cards={recipientCollection.cards}
              onSelectionChange={setRecipientCards}
              selectedRows={recipientCards}
            />
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}

function buildTradeRequest({
  requester,
  recipient,
  requesterCards,
  recipientCards,
}: {
  requester: User;
  recipient: User;
  requesterCards: SelectedCard[];
  recipientCards: SelectedCard[];
}) {
  return {
    requester,
    recipient,
    requesterItems: { cards: requesterCards },
    recipientItems: { cards: recipientCards },
  };
}
