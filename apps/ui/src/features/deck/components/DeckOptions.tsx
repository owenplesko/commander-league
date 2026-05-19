import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";
import { EditDeckModal } from "./EditDeckModal";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/client";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { confirmDialog } from "primereact/confirmdialog";
import { DeckBulkEditModal } from "./BulkEdit";
import { AddDeckCard } from "./AddDeckCard";
import type { Deck } from "@commander-league/contract/schemas";
import { marshalDeck } from "../lib/marshalDeck";

export function DeckOptions({ deck }: { deck: Deck }) {
  const router = useRouter();
  const { user } = useRouteContext({ from: "/_auth" });

  const [modal, setModal] = useState<"edit-deck" | "bulk-edit" | null>(null);
  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());

  const isSelf = deck.owner.user.id === user.id;

  return (
    <div className="routeActions">
      {isSelf && (
        <>
          <AddDeckCard
            deckId={deck.id}
            collectionId={deck.owner.collectionId}
          />
          <Button
            icon={PrimeIcons.COG}
            label="Settings"
            text
            onClick={() => setModal("edit-deck")}
          />
          <EditDeckModal
            deckId={deck.id}
            visible={modal === "edit-deck"}
            onHide={() => setModal((cur) => (cur === "edit-deck" ? null : cur))}
          />
          <Button
            icon={PrimeIcons.PENCIL}
            label="Bulk Edit"
            text
            onClick={() => setModal("bulk-edit")}
          />
          <DeckBulkEditModal
            deckId={deck.id}
            visible={modal === "bulk-edit"}
            onHide={() => setModal((cur) => (cur === "bulk-edit" ? null : cur))}
          />
        </>
      )}
      <Button
        text
        icon={PrimeIcons.COPY}
        label="Export"
        onClick={() => navigator.clipboard.writeText(marshalDeck(deck))}
      />
      {isSelf && (
        <>
          <Button
            icon={PrimeIcons.TRASH}
            label="Delete"
            text
            severity="danger"
            onClick={() => {
              confirmDialog({
                header: "Confirmation",
                message: "Are you sure you want to delete deck?",
                icon: PrimeIcons.EXCLAMATION_TRIANGLE,
                defaultFocus: "reject",
                accept: async () => {
                  await deleteMutation.mutateAsync({ deckId: deck.id });
                  router.navigate({
                    to: "/user/$userId/decks",
                    params: { userId: deck.owner.user.id },
                  });
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}
