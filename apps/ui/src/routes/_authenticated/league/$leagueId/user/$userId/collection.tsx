import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { CollectionBulkEditModal } from "../../../../../../components/modals/CollectionBulkEdit";
import { queryClient, orpc } from "../../../../../../lib/client";
import { CardTable } from "../../../../../../features/cardTable/components/CardTable";
import type { MenuCard } from "../../../../../../features/cardTable/types/menuCard";
import type { MenuItem } from "primereact/menuitem";
import { de } from "zod/v4/locales";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/collection",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      await queryClient.ensureQueryData(
        orpc.league.member.get.queryOptions({
          input: { leagueId: params.leagueId, userId: params.userId },
        }),
      );
    } catch {
      throw redirect({ to: "/league/$leagueId", params });
    }

    await queryClient.ensureQueryData(
      orpc.collection.get.queryOptions({
        input: { leagueId: params.leagueId, userId: params.userId },
      }),
    );
  },
});

function RouteComponent() {
  const { leagueId, userId } = Route.useParams();
  const { user: self } = Route.useRouteContext();

  const { data: member } = useSuspenseQuery(
    orpc.league.member.get.queryOptions({ input: { leagueId, userId } }),
  );
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { leagueId, userId } }),
  );
  const { data: decks } = useQuery(
    orpc.deck.list.queryOptions({ input: { leagueId, userId } }),
  );
  const addToDeckMutation = useMutation(
    orpc.deck.updateCards.mutationOptions(),
  );

  const [modal, setModal] = useState<"bulk-edit" | null>(null);

  function cardMenuOptions({ card }: MenuCard): MenuItem[] | null {
    if (member.user.id !== self.id) return null;

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
      <Button
        style={{ marginRight: "auto" }}
        label="Bulk Edit"
        onClick={() => {
          setModal("bulk-edit");
        }}
      />
      <CardTable
        cardQuantities={collection.cardQuantities}
        menuOptionsTemplate={cardMenuOptions}
      />
      <CollectionBulkEditModal
        collection={collection}
        userId={userId}
        leagueId={leagueId}
        visible={modal === "bulk-edit"}
        onHide={() => {
          setModal(null);
        }}
      />
    </>
  );
}
