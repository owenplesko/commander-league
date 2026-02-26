import classes from "./collection.module.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { scryfallImgUrl } from "../../../lib/utils";
import { useEffect, useState } from "react";
import { CardTable } from "../../../components/CardTable";
import type { CollectionCard } from "@commander-league/contract/schemas";
import { orpc, queryClient } from "../../../lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { CollectionBulkEditModal } from "../../../components/modals/CollectionBulkEdit";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/collection/$userId",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const member = await queryClient.ensureQueryData(
      orpc.league.member.get.queryOptions({
        input: { leagueId: params.leagueId, userId: params.userId },
      }),
    );

    if (!member) throw notFound();

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

  const [hoveredCard, setHoveredCard] = useState<CollectionCard | null>(null);
  const [modal, setModal] = useState<"bulk-edit" | null>(null);

  useEffect(() => {
    setHoveredCard(null);
  }, [leagueId, userId]);

  return (
    <>
      <div className={classes.wrapper}>
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
                hoveredCard?.data.printings.at(0)!.scryfallId ?? null,
              )}
            />
          </div>
          <CardTable
            cards={collection.cards}
            setHovered={(c) => setHoveredCard(c)}
          />
        </div>
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
