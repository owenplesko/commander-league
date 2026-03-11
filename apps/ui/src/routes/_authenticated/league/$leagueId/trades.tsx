import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "primereact/dataview";
import { orpc, queryClient } from "../../../../lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import type {
  TradeRequest,
  TradeStatus,
} from "@commander-league/contract/schemas";
import { TradeItemsPreview } from "../../../../components/TradePreview";
import { UserBadge } from "../../../../components/UserBadge";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Tag, type TagProps } from "primereact/tag";

export const Route = createFileRoute("/_authenticated/league/$leagueId/trades")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      await queryClient.ensureQueryData(
        orpc.trade.list.queryOptions({ input: { leagueId: params.leagueId } }),
      );
    },
  },
);

function TradeStatusTag({ status }: { status: TradeStatus }) {
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

function RouteComponent() {
  const { leagueId } = Route.useParams();
  const { data: trades } = useSuspenseQuery(
    orpc.trade.list.queryOptions({ input: { leagueId } }),
  );

  function tradeTemplate(trades: TradeRequest[]) {
    return (
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {trades.map((trade) => (
          <li key={trade.id} className="card">
            <div
              style={{
                display: "flex",
                gap: "1rem",
                placeItems: "center",
                marginBottom: "1rem",
              }}
            >
              <UserBadge user={trade.requester} />
              <TradeStatusTag status={trade.requesterStatus} />
              <div style={{ flexGrow: 1 }} />
              <UserBadge user={trade.recipient} />
              <TradeStatusTag status={trade.recipientStatus} />
              <Button
                text
                size="small"
                severity="secondary"
                icon={PrimeIcons.ELLIPSIS_V}
              />
            </div>
            <TradeItemsPreview
              requesterItems={trade.requesterItems}
              recipientItems={trade.recipientItems}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <h1>Trades</h1>
      <DataView value={trades} listTemplate={tradeTemplate} />
    </>
  );
}
