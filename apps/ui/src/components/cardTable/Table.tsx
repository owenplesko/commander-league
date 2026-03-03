import type { CollectionCard } from "@commander-league/contract/schemas";
import classes from "./table.module.css";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";
import { type GroupOption, groupOptions, organizeCards } from "./grouping";
import { type SelectedCard, selectedCardsReducer } from "./selection";
import { Cell } from "./Cell";

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
                <li key={cardEntry.card.name}>
                  <Cell
                    row={cardEntry}
                    onSelectionChange={onSelectionChange}
                    selectedRows={selectedRows}
                    onRowHover={onRowHover}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
