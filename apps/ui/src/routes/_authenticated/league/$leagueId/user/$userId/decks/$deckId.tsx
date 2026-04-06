import { createFileRoute, useRouter } from "@tanstack/react-router";
import z from "zod";
import { CardTable } from "../../../../../../../components/cardTable/Table";
import { orpc, queryClient } from "../../../../../../../lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";

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
  const { deckId } = Route.useParams();
  const { data: deck } = useSuspenseQuery(
    orpc.deck.get.queryOptions({ input: { deckId } }),
  );
  const deleteMutation = useMutation(orpc.deck.delete.mutationOptions());

  return (
    <div>
      <h1>{deck.name}</h1>
      <Button label="Edit" />
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
      <CardTable cards={deck.cards} />
    </div>
  );
}
