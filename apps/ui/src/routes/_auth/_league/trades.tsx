import { UserBadge } from "@/features/common/components/UserBade";
import { TradeItemsPreview } from "@/features/trade/components/TradePreview";
import { orpc, queryClient } from "@/lib/client";
import type {
  TradeStatus,
  TradeRequest,
} from "@commander-league/contract/schemas";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { type TagProps, Tag } from "primereact/tag";
import { useRef, useState, useMemo } from "react";
import { DataView } from "primereact/dataview";

export const Route = createFileRoute("/_auth/_league/trades")({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(orpc.trade.list.queryOptions());
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
  const { user } = Route.useRouteContext();
  const { data: trades } = useSuspenseQuery(orpc.trade.list.queryOptions());

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
                <UserBadge user={trade.requester.user} />
                <TradeStatusTag status={trade.requesterStatus} />
                <div style={{ flexGrow: 1 }} />
                <UserBadge user={trade.recipient.user} />
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
      menuTrade.requester.user.id === user.id
        ? "requester"
        : menuTrade.recipient.user.id
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
