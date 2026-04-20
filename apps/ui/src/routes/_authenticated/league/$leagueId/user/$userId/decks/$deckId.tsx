import { createFileRoute, useRouter } from "@tanstack/react-router";
import z from "zod";
import { CardTable } from "../../../../../../../components/cardTable/Table";
import { orpc, queryClient } from "../../../../../../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { EditDeck } from "../../../../../../../components/modals/EditDeckModal";
import { useState } from "react";
import type { CardGroup } from "../../../../../../../components/cardTable/organize";

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
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );
  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());
  const [modal, setModal] = useState<"edit" | null>(null);

  const commanderGroup: CardGroup = {
    groupId: "commander",
    count: 1,
    cardEntries: [{ card: deck.commanderCard, quantity: 1 }],
  };

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
      </div>
      <div className="card">
        <CardTable
          pinnedGroups={[commanderGroup]}
          cards={deck.cardQuantities}
        />
      </div>
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
