import classes from "./collection.module.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "../../../lib/client";
import { scryfallImgUrl } from "../../../lib/utils";
import { useState } from "react";
import { CardTable } from "../../../components/CardTable";
import type { CollectionCard } from "@commander-league/contract/schemas";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/collection/$userId",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const memberPromise = client.league.member.get({
      leagueId: params.leagueId,
      userId: params.userId,
    });
    const collectionPromise = client.collection.get({
      leagueId: params.leagueId,
      userId: params.userId,
    });

    const member = await memberPromise;
    if (!member) throw notFound();
    const collection = await collectionPromise;

    return { member, collection };
  },
});

function RouteComponent() {
  const { member, collection } = Route.useLoaderData();
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
