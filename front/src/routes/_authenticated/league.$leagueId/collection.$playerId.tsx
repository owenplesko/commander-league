import classes from "./collection.module.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { orpc } from "../../../lib/client";
import type { CollectionCard } from "../../../../../back/src/schemas/card";
import { scryfallImgUrl } from "../../../lib/utils";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { groupCards, type GroupByOptions } from "../../../lib/groupCards";

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

const groupOptions = [{ label: "Color", value: "COLOR" }];

function RouteComponent() {
  const { player, collection } = Route.useLoaderData();
  const [hoveredCard, setHoveredCard] = useState<CollectionCard | null>(
    collection[0],
  );
  const [groupBy, setGroupBy] = useState<GroupByOptions>("COLOR");

  const cardGroups = groupCards(collection, { groupBy });

  function GridItem(card: CollectionCard) {
    return (
      <li
        key={card.name}
        className={classes.card}
        onMouseEnter={() => setHoveredCard(card)}
      >{`${card.quantity} ${card.name}`}</li>
    );
  }

  return (
    <div className={classes.wrapper}>
      <h1>{`${player.name}'s Collection !`}</h1>
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
        <div>
          <div className={classes.header}>
            <FloatLabel>
              <Dropdown
                options={groupOptions}
                value={groupBy}
                onChange={(e) => setGroupBy(e.value)}
                optionLabel="label"
              />
              <label>Group</label>
            </FloatLabel>
            <FloatLabel>
              <Dropdown />
              <label>Filter</label>
            </FloatLabel>
            <FloatLabel>
              <Dropdown />
              <label>Sort</label>
            </FloatLabel>
          </div>
          <div className={classes.masonry}>
            {Object.entries(cardGroups).map(([groupId, { cards }]) => (
              <div>
                {groupId}
                <ul>{cards.map((card) => GridItem(card))}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
