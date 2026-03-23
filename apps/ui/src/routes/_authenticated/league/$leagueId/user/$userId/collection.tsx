import classes from "./collection.module.css";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CollectionCard } from "@commander-league/contract/schemas";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { CardTable } from "../../../../../../components/cardTable/Table";
import { CollectionBulkEditModal } from "../../../../../../components/modals/CollectionBulkEdit";
import { queryClient, orpc } from "../../../../../../lib/client";
import { scryfallImgUrl } from "../../../../../../lib/utils";

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

  const { data: member } = useSuspenseQuery(
    orpc.league.member.get.queryOptions({ input: { leagueId, userId } }),
  );
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { leagueId, userId } }),
  );

  const [hoveredRow, setHoveredRow] = useState<CollectionCard | null>(null);
  const [modal, setModal] = useState<"bulk-edit" | null>(null);

  useEffect(() => {
    setHoveredRow(null);
  }, [leagueId, userId]);

  return (
    <>
      <h1>{`${member.user.name}'s Collection`}</h1>
      <Button
        label="Bulk Edit"
        onClick={() => {
          setModal("bulk-edit");
        }}
      />
      <div className={classes.layout}>
        <div>
          <img
            className={classes.preview}
            width={250}
            src={scryfallImgUrl(
              hoveredRow?.card.data.printings.at(0)!.scryfallId ?? null,
            )}
          />
        </div>
        <CardTable
          cards={collection.cards}
          onRowHover={(c) => setHoveredRow(c)}
        />
      </div>
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
