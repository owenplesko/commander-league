import classes from "./TradePreview.module.css";
import type { TradeItems } from "@commander-league/contract/schemas";
import { scryfallImgUrl } from "../lib/utils";
import { Badge } from "primereact/badge";

type Props = {
  requesterItems: TradeItems;
  recipientItems: TradeItems;
};

function ItemsPreview({ items: { cardQuantities } }: { items: TradeItems }) {
  return (
    <div className={classes.itemsPreview}>
      <div className={classes.itemsPreviewScroller}>
        {cardQuantities.map((item) => (
          <div style={{ position: "relative" }}>
            <img
              className={classes.itemsPreviewCard}
              src={scryfallImgUrl(
                item.card.data.printings[0]?.scryfallId ?? null,
              )}
            />
            {item.quantity > 1 && (
              <Badge className={classes.topRight} value={item.quantity} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TradeItemsPreview({ recipientItems, requesterItems }: Props) {
  return (
    <div className={classes.tradePreview}>
      <div className={classes.tradePreviewGrid}>
        <ItemsPreview items={requesterItems} />
        <i className="pi pi-arrow-right-arrow-left" />
        <ItemsPreview items={recipientItems} />
      </div>
    </div>
  );
}
