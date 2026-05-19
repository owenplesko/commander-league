import type { CreateCardQuantity } from "@commander-league/contract/schemas";
import { Message } from "primereact/message";

export function InsufficientCardMessage({
  insufficientCardQuantities,
}: {
  insufficientCardQuantities: CreateCardQuantity[];
}) {
  return (
    <Message
      severity="error"
      text={`Missing Cards: ${insufficientCardQuantities.map(({ quantity, cardName }) => `${quantity} ${cardName}`).join(", ")}`}
    />
  );
}
