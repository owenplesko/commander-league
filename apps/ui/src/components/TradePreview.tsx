import classes from "./TradePreview.module.css";
import type {
  TradeItems,
  TradeRequest,
} from "@commander-league/contract/schemas";
import { scryfallImgUrl, type Optional } from "../lib/utils";
import { UserBadge } from "./UserBadge";

type Props = {
  tradeRequest: Optional<
    TradeRequest,
    "id" | "requesterAccept" | "recipientAccept"
  >;
};

function ItemsPreview({ items: { cards } }: { items: TradeItems }) {
  return (
    <div className={classes.itemsPreview}>
      <div className={classes.itemsPreviewScroller}>
        {cards.map((item) => (
          <img
            className={classes.itemsPreviewCard}
            src={scryfallImgUrl(
              item.card.data.printings[0]?.scryfallId ?? null,
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function TradePreview({
  tradeRequest: { recipient, requester, recipientItems, requesterItems },
}: Props) {
  return (
    <div className={classes.tradePreview}>
      <div className={classes.tradePreviewHeader}>
        <UserBadge user={requester} />
        <UserBadge user={recipient} />
      </div>

      <div className={classes.tradePreviewGrid}>
        <ItemsPreview items={requesterItems} />
        <ItemsPreview items={recipientItems} />
      </div>
    </div>
  );
}
