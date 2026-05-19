import type { TradeStatus } from "@commander-league/contract/schemas";
import { PrimeIcons } from "primereact/api";
import { type TagProps, Tag } from "primereact/tag";

export function TradeStatusTag({ status }: { status: TradeStatus }) {
  const tagProps: Record<TradeStatus, TagProps> = {
    accepted: {
      value: "Accepted",
      severity: "success",
      icon: PrimeIcons.CHECK,
    },
    pending: {
      value: "Pending",
      severity: "warning",
      icon: PrimeIcons.CLOCK,
    },
    rejected: { value: "Rejected", severity: "danger", icon: PrimeIcons.TIMES },
  };

  return <Tag {...tagProps[status]} />;
}
