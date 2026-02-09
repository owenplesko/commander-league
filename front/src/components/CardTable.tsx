import classes from "./CardTable.module.css";
import type { Card, CollectionCard } from "../../../back/src/schemas/card";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState, type ReactNode } from "react";

export type GroupByOptions = "COLOR";

type CardGroups = Record<string, CollectionCard[]>;

export function organizeCards(
  cards: CollectionCard[],
  { groupOption }: { groupOption: GroupOption },
): CardGroups {
  const cardGroups: CardGroups = {};

  for (const card of cards) {
    const groupId = groupOption.groupId(card);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = [];
    }

    cardGroups[groupId]?.push(card);
  }

  return cardGroups;
}

type GroupOption = {
  label: string;
  groupId: (c: Card) => string;
  Header: (id: string) => ReactNode;
};

const groupOptions: GroupOption[] = [
  {
    label: "Color",
    groupId: (card) => card.data.colorIdentity.join(","),
    Header: (groupId) => {
      const colorIdentities = groupId.split(",");
      return <div>{colorIdentities.join(" ")}</div>;
    },
  },
  {
    label: "Rarity",
    groupId: (c) => c.data.rarity,
    Header: (rarity) => <div>{rarity}</div>,
  },
  {
    label: "Type",
    groupId: (c) => c.data.types.join(","),
    Header: (groupId) => {
      const types = groupId.split(",");
      return <div>{types.join(" ")}</div>;
    },
  },
  {
    label: "Subtype",
    groupId: (c) => c.data.subTypes.join(","),
    Header: (groupId) => {
      const subTypes = groupId.split(",");
      return <div>{subTypes.join(" ") || "N/A"}</div>;
    },
  },
];

export function CardTable({
  cards,
  setHovered,
}: {
  cards: CollectionCard[];
  setHovered?: (c: Card) => void;
}) {
  const [groupMethods, setGroupMethods] = useState<GroupOption>(
    groupOptions[0],
  );

  const organizedCards = organizeCards(cards, { groupOption: groupMethods });

  return (
    <div>
      {/* Header */}
      <div className={classes.header}>
        <FloatLabel>
          <Dropdown
            options={groupOptions}
            value={groupMethods}
            onChange={(e) => setGroupMethods(e.value)}
            optionLabel="label"
            optionValue="methods"
            useOptionAsValue={true}
          />
          <label>Group</label>
        </FloatLabel>
      </div>
      {/* Content */}
      <div className={classes.content}>
        {Object.entries(organizedCards).map(([groupId, cards]) => (
          <div>
            {groupMethods.Header(groupId)}
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
