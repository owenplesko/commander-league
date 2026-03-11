import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "primereact/dataview";
import { orpc, queryClient } from "../../../../lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { TradeRequest } from "@commander-league/contract/schemas";
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

function TradeStatusTag({ accept }: { accept: boolean | undefined }) {
  const tagProps: TagProps =
    accept === undefined
      ? { value: "Pending", severity: "warning", icon: PrimeIcons.ELLIPSIS_H }
      : accept
        ? { value: "Accepted", severity: "success", icon: PrimeIcons.CHECK }
        : { value: "Rejected", severity: "danger", icon: PrimeIcons.TIMES };

  return <Tag {...tagProps} />;
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
          padding: "1rem",
          gap: "1rem",
        }}
      >
        {trades.map((trade) => (
          <li
            key={trade.id}
            style={{
              borderRadius: "var(--border-radius)",
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--surface-border)",
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                placeItems: "center",
                marginBottom: "1rem",
              }}
            >
              <UserBadge user={trade.requester} />
              <TradeStatusTag accept={trade.requesterAccept} />
              <div style={{ flexGrow: 1 }} />
              <UserBadge user={trade.recipient} />
              <TradeStatusTag accept={trade.recipientAccept} />
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
