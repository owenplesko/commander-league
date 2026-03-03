import type { User } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UserBadge } from "../UserBadge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../lib/client";
import { scryfallImgUrl } from "../../lib/utils";
import { TabPanel, TabView } from "primereact/tabview";
import type { SelectedCard } from "../cardTable/selection";
import { CardTable } from "../cardTable/Table";

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
  const { data: requesterCollection } = useQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId: requester.id },
    }),
  );
  const { data: recipientCollection } = useQuery(
    orpc.collection.get.queryOptions({
      input: { leagueId, userId: recipient.id },
    }),
  );

  const [requesterItems, setRequesterItems] = useState<SelectedCard[]>([]);
  const [recipientItems, setRecipientItems] = useState<SelectedCard[]>([]);

  if (!(requesterCollection && recipientCollection)) return null;

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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <UserBadge user={requester} />
            {requesterItems.map((item) => (
              <img
                width={120}
                src={scryfallImgUrl(
                  item.card.data.printings[0]?.scryfallId ?? null,
                )}
              />
            ))}
          </div>
          <div>
            <UserBadge user={recipient} />
            {recipientItems.map((item) => (
              <img
                width={120}
                src={scryfallImgUrl(
                  item.card.data.printings[0]?.scryfallId ?? null,
                )}
              />
            ))}
          </div>
        </div>
        <TabView>
          <TabPanel header={requester.name}>
            <div style={{ overflow: "auto", maxHeight: "30rem" }}>
              <CardTable
                cards={requesterCollection.cards}
                onSelectionChange={setRequesterItems}
                selectedRows={requesterItems}
              />
            </div>
          </TabPanel>
          <TabPanel header={recipient.name}>
            <div style={{ overflow: "auto", maxHeight: "30rem" }}>
              <CardTable
                cards={recipientCollection.cards}
                onSelectionChange={setRecipientItems}
                selectedRows={recipientItems}
              />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </Dialog>
  );
}
