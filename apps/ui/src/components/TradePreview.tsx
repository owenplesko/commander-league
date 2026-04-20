import classes from "./TradePreview.module.css";
import { scryfallImgUrl } from "../lib/utils";
import { Badge } from "primereact/badge";
import { type CardQuantity } from "@commander-league/contract/schemas";

type Props = {
  requesterCardQuantities: CardQuantity[];
  recipientCardQuantities: CardQuantity[];
};

function CardQuantityPreview({
  cardQuantities,
}: {
  cardQuantities: CardQuantity[];
}) {
  return (
    <div className={classes.itemsPreview}>
      <div className={classes.itemsPreviewScroller}>
        {cardQuantities.map(({ card, quantity }) => (
          <div style={{ position: "relative" }}>
            <img
              className={classes.itemsPreviewCard}
              src={scryfallImgUrl(card.data.printings[0]?.scryfallId ?? null)}
            />
            {quantity > 1 && (
              <Badge className={classes.topRight} value={quantity} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TradeItemsPreview({
  recipientCardQuantities: recipientItems,
  requesterCardQuantities: requesterItems,
}: Props) {
  return (
    <div className={classes.tradePreview}>
      <div className={classes.tradePreviewGrid}>
        <CardQuantityPreview cardQuantities={requesterItems} />
        <i className="pi pi-arrow-right-arrow-left" />
        <CardQuantityPreview cardQuantities={recipientItems} />
      </div>
    </div>
  );
}
