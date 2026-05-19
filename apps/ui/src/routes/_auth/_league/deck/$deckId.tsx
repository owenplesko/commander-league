import { InsufficientCardMessage } from "@/features/common/components/InsufficientCardMessage";
import { AddDeckCard } from "@/features/deck/components/AddDeckCard";
import { DeckCardTable } from "@/features/deck/components/DeckCardTable";
import { DeckOptions } from "@/features/deck/components/DeckOptions";
import { marshalDeck } from "@/features/deck/lib/marshalDeck";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
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
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <h1>{deck.name}</h1>
        {isSelf && <DeckOptions deckId={deckId} />}
        <Button
          text
          icon={PrimeIcons.COPY}
          label="Export"
          onClick={() => navigator.clipboard.writeText(marshalDeck(deck))}
        />
      </div>
      {deck.insufficientCardQuantities.length > 0 && (
        <InsufficientCardMessage
          insufficientCardQuantities={deck.insufficientCardQuantities}
        />
      )}
      {isSelf && (
        <AddDeckCard deckId={deckId} collectionId={deck.owner.collectionId} />
      )}
      <DeckCardTable deck={deck} readonly={!isSelf} />
    </>
  );
}
