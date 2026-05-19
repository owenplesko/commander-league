import { CardTable } from "@/features/cardTable/components/CardTable";
import type { MenuCard } from "@/features/cardTable/types/menuCard";
import { CollectionActions } from "@/features/collection/components/CollectionSettings";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery, useQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { MenuItem } from "primereact/menuitem";

export const Route = createFileRoute("/_auth/_league/user/$userId/collection")({
  component: RouteComponent,
  loader: async ({ params: { userId } }) => {
    await queryClient.ensureQueryData(
      orpc.member.get.queryOptions({ input: { userId } }),
    );
    await queryClient.ensureQueryData(
      orpc.collection.get.queryOptions({ input: { userId } }),
    );
  },
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { user: self } = Route.useRouteContext();
  const isSelf = userId === self.id;

  const { data: member } = useSuspenseQuery(
    orpc.member.get.queryOptions({ input: { userId } }),
  );
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { userId } }),
  );

  const addToDeckMutation = useMutation(
    orpc.deck.updateCards.mutationOptions(),
  );
  const { data: decks } = useQuery(
    orpc.deck.list.queryOptions({ enabled: isSelf, input: { userId } }),
  );

  function cardMenuOptions({ card }: MenuCard): MenuItem[] | null {
    if (!isSelf) return null;

    return [
      {
        label: "Add to Deck",
        items: decks?.map((deck) => ({
          label: deck.name,
          async command() {
            addToDeckMutation.mutateAsync({
              deckId: deck.id,
              cardDeltas: [{ cardName: card.name, quantity: 1 }],
            });
          },
        })),
      },
    ];
  }

  return (
    <>
      <h1>{`${member.user.name}'s Collection`}</h1>
      <CollectionActions userId={userId} />
      <CardTable
        cardQuantities={collection.cardQuantities}
        menuOptionsTemplate={cardMenuOptions}
      />
    </>
  );
}
