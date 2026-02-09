import classes from "./CardTable.module.css";
import type { Card, CollectionCard } from "../../../back/src/schemas/card";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState, type ReactNode } from "react";

export type GroupByOptions = "COLOR";

type CardGroups = Record<string, CollectionCard[]>;

export function organizeCards(
  cards: CollectionCard[],
  { groupMethods }: { groupMethods: GroupMethods },
): CardGroups {
  const cardGroups: CardGroups = {};

  for (const card of cards) {
    const groupId = groupMethods.groupId(card);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = [];
    }

    cardGroups[groupId]?.push(card);
  }

  return cardGroups;
}

type GroupMethods = {
  groupId: (c: Card) => string;
  Header: (id: string) => ReactNode;
};
type GroupOption = {
  label: string;
  methods: GroupMethods;
};

const groupOptions: GroupOption[] = [
  {
    label: "Color",
    methods: {
      groupId: (card) => card.data.colorIdentity.join(","),
      Header: (groupId) => {
        const colorIdentities = groupId.split(",");
        return <div>{colorIdentities.join(" ")}</div>;
      },
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
  const [groupMethods, setGroupMethods] = useState<GroupMethods>(
    groupOptions[0].methods,
  );

  const organizedCards = organizeCards(cards, { groupMethods: groupMethods });

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
