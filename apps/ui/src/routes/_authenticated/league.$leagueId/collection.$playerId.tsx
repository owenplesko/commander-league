import classes from "./collection.module.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { orpc } from "../../../lib/client";
import type { Card } from "../../../../../back/src/schemas/card";
import { scryfallImgUrl } from "../../../lib/utils";
import { useState } from "react";
import { CardTable } from "../../../components/CardTable";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/collection/$playerId",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const playerPromise = orpc.leaguePlayer.get({
      leagueId: params.leagueId,
      playerId: params.playerId,
    });
    const collectionPromise = orpc.collection.list({
      leagueId: params.leagueId,
      playerId: params.playerId,
    });

    const player = await playerPromise;
    if (!player) throw notFound();
    const collection = await collectionPromise;
    console.log(collection);

    return { player, collection };
  },
});

function RouteComponent() {
  const { player, collection } = Route.useLoaderData();
  const [hoveredCard, setHoveredCard] = useState<Card | null>(collection[0]);

  return (
    <div className={classes.wrapper}>
      <h1>{`${player.name}'s Collection`}</h1>
      <div className={classes.layout}>
        <div>
          {hoveredCard && (
            <img
              className={classes.preview}
              width={250}
              src={scryfallImgUrl(hoveredCard.data.printings[0].scryfallId)}
            />
          )}
        </div>
        <CardTable cards={collection} setHovered={(c) => setHoveredCard(c)} />
      </div>
    </div>
  );
}
