import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useRouteContext } from "@tanstack/react-router";
import { CollectionBulkEditModal } from "./CollectionBulkEdit";
import { useState } from "react";

export function CollectionActions({ userId }: { userId: string }) {
  const { membership } = useRouteContext({ from: "/_auth/_league" });

  const selfOrAdmin = membership.admin || membership.user.id === userId;

  const [modal, setModal] = useState<"bulk-edit" | null>(null);

  return (
    <>
      <div className="routeActions">
        {selfOrAdmin && (
          <Button
            icon={PrimeIcons.PENCIL}
            label="Bulk Edit"
            text
            onClick={() => setModal("bulk-edit")}
          />
        )}
      </div>

      <CollectionBulkEditModal
        userId={userId}
        visible={modal === "bulk-edit"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
