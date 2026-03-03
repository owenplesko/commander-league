import type { Card, CollectionCard } from "@commander-league/contract/schemas";
import classes from "./CardTable.module.css";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState, type ReactNode } from "react";
import { classNames } from "primereact/utils";

type CardGroup = {
  groupId: string;
  count: number;
  cardEntries: CollectionCard[];
};

export type SelectedCard = CollectionCard & { selectedQuantity: number };

type ReducerAction =
  | {
      type: "select";
      entry: CollectionCard;
    }
  | {
      type: "inc";
      cardName: string;
      delta: number;
    }
  | {
      type: "unselect";
      cardName: string;
    };

function selectedCardsReducer(
  state: SelectedCard[],
  action: ReducerAction,
): SelectedCard[] {
  switch (action.type) {
    case "select":
      return [...state, { ...action.entry, selectedQuantity: 1 }];
    case "inc":
      return state.map((e) =>
        e.card.name === action.cardName
          ? { ...e, selectedQuantity: e.selectedQuantity + action.delta }
          : e,
      );
    case "unselect":
      return state.filter((e) => e.card.name !== action.cardName);
  }
}

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

type Props = {
  cards: CollectionCard[];
  onRowHover?: (c: CollectionCard) => void;
  onSelectionChange?: (selection: SelectedCard[]) => void;
  selectedRows?: SelectedCard[];
};

export function CardTable({
  cards,
  onRowHover = () => {},
  onSelectionChange = () => {},
  selectedRows = [],
}: Props) {
  const [groupMethods, setGroupMethods] = useState<GroupOption>(
    groupOptions[0]!,
  );

  const organizedCards = organizeCards(cards, { groupOption: groupMethods });

  function SelectedRow(entry: SelectedCard) {
    return (
      <>
        <span style={{ marginRight: "auto" }}>
          {`${entry.selectedQuantity}/${entry.quantity} ${entry.card.name}`}
        </span>
        {entry.selectedQuantity < entry.quantity ? (
          <i
            className="pi pi-sort-up-fill"
            onClick={() => {
              onSelectionChange(
                selectedCardsReducer(selectedRows, {
                  type: "inc",
                  cardName: entry.card.name,
                  delta: 1,
                }),
              );
            }}
          />
        ) : (
          <i className={classNames("pi pi-sort-up", classes.disabled)} />
        )}
        {entry.selectedQuantity > 1 ? (
          <i
            className="pi pi-sort-down-fill"
            onClick={() => {
              onSelectionChange(
                selectedCardsReducer(selectedRows, {
                  type: "inc",
                  cardName: entry.card.name,
                  delta: -1,
                }),
              );
            }}
          />
        ) : (
          <i className={classNames("pi pi-sort-down", classes.disabled)} />
        )}
        <i
          className="pi pi-times"
          onClick={() => {
            onSelectionChange(
              selectedCardsReducer(selectedRows, {
                type: "unselect",
                cardName: entry.card.name,
              }),
            );
          }}
        />
      </>
    );
  }

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
              {cardEntries.map((cardEntry) => {
                const selected = selectedRows?.find(
                  (r) => r.card.name === cardEntry.card.name,
                );

                return (
                  <li
                    key={cardEntry.card.name}
                    className={classNames(
                      classes.item,
                      selected ? classes.selected : undefined,
                    )}
                    onMouseEnter={
                      onRowHover ? () => onRowHover(cardEntry) : undefined
                    }
                    onClick={
                      selected
                        ? undefined
                        : () =>
                            onSelectionChange(
                              selectedCardsReducer(selectedRows, {
                                type: "select",
                                entry: cardEntry,
                              }),
                            )
                    }
                  >
                    {selected
                      ? SelectedRow(selected)
                      : `${cardEntry.quantity} ${cardEntry.card.name}`}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
