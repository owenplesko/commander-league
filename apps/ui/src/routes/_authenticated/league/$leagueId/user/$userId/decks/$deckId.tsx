import { createFileRoute, useRouter } from "@tanstack/react-router";
import z from "zod";
import { orpc, queryClient } from "../../../../../../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { useState } from "react";
import { AddDeckCard } from "../../../../../../../features/deck/components/AddDeckCard";
import { EditDeck } from "../../../../../../../features/deck/components/EditDeckModal";
import { DeckCardTable } from "../../../../../../../features/deck/components/DeckCardTable";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/decks/$deckId",
)({
  params: z.object({ userId: z.string(), deckId: z.coerce.number() }),
  component: RouteComponent,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      orpc.deck.get.queryOptions({ input: { deckId: params.deckId } }),
    );
  },
});

function RouteComponent() {
  const router = useRouter();
  const { deckId, userId, leagueId } = Route.useParams();
  const { leagueMembership } = Route.useRouteContext();
  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());
  const [modal, setModal] = useState<"edit" | null>(null);

  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );

  return (
    <>
      <h1>{deck.name}</h1>
      <div>
        <Button label="Edit" onClick={() => setModal("edit")} />
        <Button
          label="Delete"
          onClick={async () => {
            await deleteMutation.mutateAsync({ deckId });
            router.navigate({
              from: Route.fullPath,
              to: "/league/$leagueId/user/$userId/decks",
            });
          }}
        />
        <AddDeckCard
          deckId={deckId}
          collectionId={leagueMembership.collectionId}
        />
      </div>
      <DeckCardTable
        deck={deck}
        readonly={deck.owner.id !== leagueMembership.user.id}
      />
      <EditDeck
        deckId={deckId}
        userId={userId}
        leagueId={leagueId}
        visible={modal === "edit"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
