import type { Card, CollectionCard } from "@commander-league/contract/schemas";
import classes from "./CardTable.module.css";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState, type ReactNode } from "react";

type CardGroup = {
  groupId: string;
  count: number;
  cardEntries: CollectionCard[];
};

export function organizeCards(
  cardEntries: CollectionCard[],
  { groupOption }: { groupOption: GroupOption },
): CardGroup[] {
  const cardGroups: Record<string, CardGroup> = {};

  for (const cardEntry of cardEntries) {
    const groupId = groupOption.groupId(cardEntry.card);

    if (!(groupId in cardGroups)) {
      cardGroups[groupId] = { groupId, count: 0, cardEntries: [] };
    }

    const group = cardGroups[groupId]!;

    group.cardEntries.push(cardEntry);
    group.count += 1;
  }

  return Object.values(cardGroups).sort((a, b) => b.count - a.count);
}

type GroupOption = {
  label: string;
  groupId: (c: Card) => string;
  header: (id: string) => ReactNode;
};

const groupOptions: GroupOption[] = [
  {
    label: "Color",
    groupId: (card) => card.data.colorIdentity.join(","),
    header: (groupId) => {
      const colorIdentities = groupId.split(",");
      return (
        <>
          {colorIdentities.map((c) => (
            <img
              width={18}
              height={18}
              src={`https://svgs.scryfall.io/card-symbols/${c || "C"}.svg`}
            />
          ))}
        </>
      );
    },
  },
  {
    label: "Rarity",
    groupId: (c) => c.data.rarity,
    header: (rarity) => rarity,
  },
  {
    label: "Type",
    groupId: (c) => c.data.types.join(","),
    header: (groupId) => {
      const types = groupId.split(",");
      return types.join(" ");
    },
  },
  {
    label: "Subtype",
    groupId: (c) => c.data.subTypes.join(","),
    header: (groupId) => {
      const subTypes = groupId.split(",");
      return subTypes.join(" ") || "N/A";
    },
  },
];

export function CardTable({
  cards,
  setHoveredRow,
}: {
  cards: CollectionCard[];
  setHoveredRow?: (c: CollectionCard) => void;
}) {
  const [groupMethods, setGroupMethods] = useState<GroupOption>(
    groupOptions[0]!,
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
        {organizedCards.map(({ groupId, count, cardEntries }) => (
          <div>
            <div className={classes.groupHeader}>
              {groupMethods.header(groupId)}
              <span className={classes.count}>{`(${count})`}</span>
            </div>
            <ul>
              {cardEntries.map((cardEntry) => (
                <li
                  key={cardEntry.card.name}
                  className={classes.item}
                  onMouseEnter={
                    setHoveredRow ? () => setHoveredRow(cardEntry) : undefined
                  }
                >{`${cardEntry.quantity} ${cardEntry.card.name}`}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
