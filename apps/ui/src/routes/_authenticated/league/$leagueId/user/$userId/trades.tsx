import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "primereact/dataview";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type {
  TradeRequest,
  TradeStatus,
} from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Tag, type TagProps } from "primereact/tag";
import { Menu } from "primereact/menu";
import { useMemo, useRef, useState } from "react";
import type { MenuItem } from "primereact/menuitem";
import { queryClient, orpc } from "../../../../../../lib/client";
import { TradeItemsPreview } from "../../../../../../features/trade/components/TradePreview";
import { UserBadge } from "../../../../../../features/common/components/UserBade";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/trades",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      orpc.trade.list.queryOptions({ input: { leagueId: params.leagueId } }),
    );
  },
});

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
  const { user } = Route.useRouteContext();
  const { data: trades } = useSuspenseQuery(
    orpc.trade.list.queryOptions({ input: { leagueId } }),
  );
  const statusMutation = useMutation(orpc.trade.setStatus.mutationOptions());
  const deleteMutation = useMutation(orpc.trade.delete.mutationOptions());

  const menuRef = useRef<Menu>(null);
  const [menuTrade, setMenuTrade] = useState<TradeRequest | null>(null);

  function tradeTemplate(trades: TradeRequest[]) {
    return (
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {trades.map((trade) => {
          return (
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
                  onClick={(e) => {
                    setMenuTrade(trade);
                    menuRef.current?.toggle(e);
                  }}
                />
              </div>
              <TradeItemsPreview
                requesterCardQuantities={trade.requesterCardQuantities}
                recipientCardQuantities={trade.recipientCardQuantities}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  const menuItems = useMemo(() => {
    if (!menuTrade) return [];

    const tradeRole =
      menuTrade.requester.id === user.id
        ? "requester"
        : menuTrade.recipient.id
          ? "recipient"
          : null;
    if (!tradeRole) return [];

    const status =
      tradeRole === "requester"
        ? menuTrade.requesterStatus
        : menuTrade.recipientStatus;

    let model: MenuItem[] = [];
    if (status !== "accepted")
      model.push({
        label: "Accept",
        command: () => {
          statusMutation.mutate({
            leagueId: leagueId,
            tradeId: menuTrade.id,
            status: "accepted",
          });
        },
      });

    if (status !== "rejected")
      model.push({
        label: "Reject",
        command: () => {
          statusMutation.mutate({
            leagueId: leagueId,
            tradeId: menuTrade.id,
            status: "rejected",
          });
        },
      });

    if (tradeRole === "requester")
      model.push({
        label: "Delete",
        command: () => {
          deleteMutation.mutate({
            leagueId: leagueId,
            tradeId: menuTrade.id,
          });
        },
      });

    return model;
  }, [menuTrade, user]);

  return (
    <>
      <h1>Trades</h1>
      <DataView value={trades} listTemplate={tradeTemplate} />
      <Menu popup ref={menuRef} model={menuItems} />
    </>
  );
}
