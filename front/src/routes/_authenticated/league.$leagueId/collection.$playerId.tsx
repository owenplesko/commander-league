import classes from "./collection.module.css";
import { DataView } from "primereact/dataview";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { orpc } from "../../../lib/client";
import type { Card } from "../../../../../back/src/schemas/card";
import { scryfallImgUrl } from "../../../lib/utils";

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

  return (
    <div>
      <h1>{`${player.name}'s Collection !`}</h1>
      <DataView value={collection} itemTemplate={GridItem} />
    </div>
  );
}

function GridItem(card: Card) {
  return (
    <div>
      <img src={scryfallImgUrl(card.data.printings[0].scryfallId)} />
    </div>
  );
}
