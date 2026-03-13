import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "primereact/dataview";
import { orpc, queryClient } from "../../../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type {
  TradeRequest,
  TradeStatus,
} from "@commander-league/contract/schemas";
import { TradeItemsPreview } from "../../../../components/TradePreview";
import { UserBadge } from "../../../../components/UserBadge";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Tag, type TagProps } from "primereact/tag";
import { Menu } from "primereact/menu";
import { useMemo, useRef, useState } from "react";
import type { MenuItem } from "primereact/menuitem";

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
          const tradeSideA = trade.sides[0]!;
          const tradeSideB = trade.sides[1]!;

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
                <UserBadge user={tradeSideA.user} />
                <TradeStatusTag status={tradeSideA.status} />
                <div style={{ flexGrow: 1 }} />
                <UserBadge user={tradeSideB.user} />
                <TradeStatusTag status={tradeSideB.status} />
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
                requesterItems={tradeSideA}
                recipientItems={tradeSideB}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  const menuItems = useMemo(() => {
    if (!menuTrade) return [];

    const userSide = menuTrade.sides.find((t) => t.user.id === user.id);
    if (!userSide) return [];

    let model: MenuItem[] = [];
    if (userSide.status !== "accepted")
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

    if (userSide.status !== "rejected")
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

    if (menuTrade.ownerId === user.id)
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
