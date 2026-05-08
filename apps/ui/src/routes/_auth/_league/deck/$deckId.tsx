import { AddDeckCard } from "@/features/deck/components/AddDeckCard";
import { DeckCardTable } from "@/features/deck/components/DeckCardTable";
import { EditDeckModal } from "@/features/deck/components/EditDeckModal";
import { orpc, queryClient } from "@/lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { useState } from "react";
import z from "zod";

export const Route = createFileRoute("/_auth/_league/deck/$deckId")({
  params: z.object({ deckId: z.coerce.number() }),
  component: RouteComponent,
  loader: async ({ params: { deckId } }) => {
    await queryClient.ensureQueryData(
      orpc.deck.get.queryOptions({ input: { deckId } }),
    );
  },
});

function RouteComponent() {
  const router = useRouter();
  const { deckId } = Route.useParams();
  const { user: self } = Route.useRouteContext();

  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );
  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());

  const isSelf = deck.owner.user.id === self.id;

  const [modal, setModal] = useState<"edit" | null>(null);

  return (
    <>
      <h1>{deck.name}</h1>
      {isSelf && (
        <div>
          <Button label="Edit" onClick={() => setModal("edit")} />
          <Button
            label="Delete"
            onClick={async () => {
              await deleteMutation.mutateAsync({ deckId });
              router.navigate({
                to: "/user/$userId/decks",
                params: {
                  userId: deck.owner.user.id,
                },
              });
            }}
          />
          <AddDeckCard deckId={deckId} collectionId={deck.owner.collectionId} />
        </div>
      )}
      <DeckCardTable deck={deck} readonly={!isSelf} />
      <EditDeckModal
        deckId={deckId}
        leagueMember={deck.owner}
        visible={modal === "edit"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
