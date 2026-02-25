import classes from "./collection.module.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { scryfallImgUrl } from "../../../lib/utils";
import { useState } from "react";
import { CardTable } from "../../../components/CardTable";
import type { CollectionCard } from "@commander-league/contract/schemas";
import { orpc, queryClient } from "../../../lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";

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

  const [hoveredCard, setHoveredCard] = useState<CollectionCard | null>(
    collection.cards.at(0) ?? null,
  );

  return (
    <div className={classes.wrapper}>
      <h1>{`${member.user.name}'s Collection`}</h1>
      <div className={classes.layout}>
        <div>
          {hoveredCard && (
            <img
              className={classes.preview}
              width={250}
              src={scryfallImgUrl(hoveredCard.data.printings.at(0)!.scryfallId)}
            />
          )}
        </div>
        <CardTable
          cards={collection.cards}
          setHovered={(c) => setHoveredCard(c)}
        />
      </div>
    </div>
  );
}
