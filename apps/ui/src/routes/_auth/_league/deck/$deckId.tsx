import { AddDeckCard } from "@/features/deck/components/AddDeckCard";
import { DeckCardTable } from "@/features/deck/components/DeckCardTable";
import { DeckOptions } from "@/features/deck/components/DeckOptions";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
  const { deckId } = Route.useParams();
  const { user: self } = Route.useRouteContext();

  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );

  const isSelf = deck.owner.user.id === self.id;

  return (
    <>
      <div style={{ display: "flex" }}>
        <h1>{deck.name}</h1> {isSelf && <DeckOptions deckId={deckId} />}
      </div>
      {isSelf && (
        <AddDeckCard deckId={deckId} collectionId={deck.owner.collectionId} />
      )}
      <DeckCardTable deck={deck} readonly={!isSelf} />
    </>
  );
}
