import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";
import { NewDeck } from "./NewDeckModal";
import type { Member } from "@commander-league/contract/schemas";
import { useRouteContext } from "@tanstack/react-router";

export function DeckListActions({ member }: { member: Member }) {
  const { user } = useRouteContext({ from: "/_auth" });

  const [modal, setModal] = useState<"create" | null>(null);

  const isSelf = user.id === member.user.id;

  return (
    <div className="routeActions">
      {isSelf && (
        <>
          <Button
            icon={PrimeIcons.PLUS}
            label="New"
            text
            onClick={() => setModal("create")}
          />
          <NewDeck
            member={member}
            visible={modal === "create"}
            onHide={() => setModal(null)}
          />
        </>
      )}
    </div>
  );
}
