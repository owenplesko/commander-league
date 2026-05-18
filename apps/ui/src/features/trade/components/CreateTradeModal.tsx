import type { Card, Member } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../../../lib/client";
import { useCardQuantityList } from "../hooks/useQuantityList";
import { CardAutoComplete } from "../../common/components/CardAutoComplete";
import { useEffect, useState } from "react";
import type { AutoCompleteSelectEvent } from "primereact/autocomplete";
import { TradeItemsPreview } from "./TradePreview";
import { UserBadge } from "../../common/components/UserBadge";

type Props = {
  requester: Member;
  recipient: Member;
  visible: boolean;
  onHide: () => void;
};

export function CreateTradeRequestModal({
  requester,
  recipient,
  visible,
  onHide,
}: Props) {
  const offerCardQuantityList = useCardQuantityList();
  const recipientCardQuantityList = useCardQuantityList();
  const [offerCardSearch, setOfferCardSearch] = useState<string>("");
  const [recipientCardSearch, setRecipientCardSearch] = useState<string>("");

  const mutation = useMutation(orpc.trade.create.mutationOptions());

  const onSubmit = async () => {
    await mutation.mutateAsync({
      offerCardQuantities: offerCardQuantityList.createCards,
      recipientId: recipient.user.id,
      recipientCardQuantities: recipientCardQuantityList.createCards,
    });
    onHide();
  };

  useEffect(() => {
    if (visible) {
      offerCardQuantityList.reset();
      recipientCardQuantityList.reset();
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
      footer={<Button label="Request" type="submit" form="create-trade" />}
    >
      <form
        style={{ display: "flex", marginBottom: "1rem" }}
        id="create-trade"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "0.5rem",
          }}
        >
          <UserBadge user={requester.user} />
          <CardAutoComplete
            collectionId={requester.collectionId}
            value={offerCardSearch}
            placeholder="add cards..."
            onChange={(e) => setOfferCardSearch(e.value)}
            onSelect={(e: AutoCompleteSelectEvent<Card>) => {
              setOfferCardSearch("");
              offerCardQuantityList.applyDelta({
                card: e.value,
                quantity: 1,
              });
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            placeItems: "end",
            flexDirection: "column",
            flex: 1,
            gap: "0.5rem",
          }}
        >
          <UserBadge user={recipient.user} />
          <CardAutoComplete
            collectionId={recipient.collectionId}
            value={recipientCardSearch}
            placeholder="add cards..."
            onChange={(e) => setRecipientCardSearch(e.value)}
            onSelect={(e: AutoCompleteSelectEvent<Card>) => {
              setRecipientCardSearch("");
              recipientCardQuantityList.applyDelta({
                card: e.value,
                quantity: 1,
              });
            }}
          />
        </div>
      </form>
      <TradeItemsPreview
        requesterCardQuantities={offerCardQuantityList.cards}
        recipientCardQuantities={recipientCardQuantityList.cards}
      />
    </Dialog>
  );
}
