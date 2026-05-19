import { UserBadge } from "@/features/common/components/UserBadge";
import type { TradeRequest } from "@commander-league/contract/schemas";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { TradeItemsPreview } from "./TradePreview";
import { TradeStatusTag } from "./TradeStatusTag";
import { Menu } from "primereact/menu";
import { useMemo, useRef } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/client";
import type { MenuItem } from "primereact/menuitem";
import { isDefinedError } from "@orpc/client";
import { InsufficientCardMessage } from "@/features/common/components/InsufficientCardMessage";

export function TradeTableRow({ trade }: { trade: TradeRequest }) {
  const { user } = useRouteContext({ from: "/_auth" });

  const menuRef = useRef<Menu>(null);

  const statusMutation = useMutation(orpc.trade.setStatus.mutationOptions());
  const executeMutation = useMutation(orpc.trade.execute.mutationOptions());
  const deleteMutation = useMutation(orpc.trade.delete.mutationOptions());

  const menuItems = useMemo(() => {
    let model: MenuItem[] = [];

    const tradeRole =
      trade.requester.user.id === user.id
        ? "requester"
        : trade.recipient.user.id
          ? "recipient"
          : null;
    if (!tradeRole) return model;

    const status =
      tradeRole === "requester" ? trade.requesterStatus : trade.recipientStatus;

    if (
      trade.requesterStatus === "accepted" &&
      trade.recipientStatus === "accepted"
    )
      model.push({
        label: "Execute",
        command: () => executeMutation.mutate({ tradeId: trade.id }),
      });

    if (status !== "accepted")
      model.push({
        label: "Accept",
        command: () => {
          statusMutation.mutate({
            tradeId: trade.id,
            status: "accepted",
          });
        },
      });

    if (status !== "rejected")
      model.push({
        label: "Reject",
        command: () => {
          statusMutation.mutate({
            tradeId: trade.id,
            status: "rejected",
          });
        },
      });

    if (tradeRole === "requester")
      model.push({
        label: "Delete",
        command: () => {
          deleteMutation.mutate({
            tradeId: trade.id,
          });
        },
      });

    return model;
  }, [trade, user]);

  const insufficientCardQuantities =
    executeMutation.error && isDefinedError(executeMutation.error)
      ? executeMutation.error.data.insufficientCardQuantities
      : null;

  return (
    <>
      <div
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            placeItems: "center",
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
              menuRef.current?.toggle(e);
            }}
          />
        </div>
        {insufficientCardQuantities && (
          <InsufficientCardMessage
            insufficientCardQuantities={insufficientCardQuantities}
          />
        )}
        <TradeItemsPreview
          requesterCardQuantities={trade.requesterCardQuantities}
          recipientCardQuantities={trade.recipientCardQuantities}
        />
      </div>
      <Menu popup ref={menuRef} model={menuItems} />
    </>
  );
}
