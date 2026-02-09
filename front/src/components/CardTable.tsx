import classes from "./CardTable.module.css";
import type { Card, CollectionCard } from "../../../back/src/schemas/card";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";

export type GroupByOptions = "COLOR";

type CardGroups = Record<string, { cards: CollectionCard[] }>;

function getGroupId(card: Card, groupBy: GroupByOptions): string {
  switch (groupBy) {
    case "COLOR":
      return card.data.colorIdentity.join(",");
  }
}

export function organizeCards(
  cards: CollectionCard[],
  { groupBy }: { groupBy: GroupByOptions },
): CardGroups {
  const cardGroups: CardGroups = {};

  for (const card of cards) {
    const groupId = getGroupId(card, groupBy);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = { cards: [] };
    }

    cardGroups[groupId]?.cards.push(card);
  }

  return cardGroups;
}

const groupOptions = [{ label: "Color", value: "COLOR" }];

export function CardTable({
  cards,
  setHovered,
}: {
  cards: CollectionCard[];
  setHovered?: (c: Card) => void;
}) {
  const [groupBy, setGroupBy] = useState<GroupByOptions>("COLOR");

  const organizedCards = organizeCards(cards, { groupBy });

  return (
    <div>
      {/* Header */}
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
      {/* Content */}
      <div className={classes.content}>
        {Object.entries(organizedCards).map(([groupId, { cards }]) => (
          <div>
            {groupId}
            <ul>
              {cards.map((card) => (
                <li
                  key={card.name}
                  className={classes.item}
                  onMouseEnter={setHovered ? () => setHovered(card) : undefined}
                >{`${card.quantity} ${card.name}`}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
