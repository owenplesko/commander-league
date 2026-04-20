import classes from "./table.module.css";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useState } from "react";
import {
  type GroupOption,
  groupOptions,
  organizeCards,
  sortOptions,
} from "./organize";
import { Cell } from "./Cell";
import type { CardQuantity } from "@commander-league/contract/schemas";
import { HoverCard } from "../HoverCard";
import { PrimeIcons } from "primereact/api";

type Props = {
  cards: CardQuantity[];
  onRowHover?: (c: CardQuantity) => void;
  onSelectionChange?: (selection: CardQuantity[]) => void;
  selectedRows?: CardQuantity[];
};

export function CardTable({
  cards,
  onSelectionChange = () => {},
  selectedRows = [],
}: Props) {
  const [hoverRow, setHoverRow] = useState<CardQuantity | null>(null);
  const [groupMethods, setGroupMethods] = useState<GroupOption>(
    groupOptions[0]!,
  );
  const [sortOption, setSortOption] = useState(sortOptions[0]!);

  const organizedCards = organizeCards(cards, {
    groupOption: groupMethods,
    sortOption,
  });

  return (
    <>
      <div>
        {/* Header */}
        <div className={classes.header}>
          <FloatLabel>
            <Dropdown
              options={groupOptions}
              value={groupMethods}
              onChange={(e) => setGroupMethods(e.value)}
              optionLabel="label"
              variant="filled"
              useOptionAsValue={true}
            />
            <label>Group by:</label>
          </FloatLabel>
          <FloatLabel>
            <Dropdown
              options={sortOptions}
              value={sortOption}
              onChange={(e) => setSortOption(e.value)}
              optionLabel="label"
              variant="filled"
              useOptionAsValue={true}
            />
            <label>Sort by:</label>
          </FloatLabel>
        </div>
        {/* Content */}
        <div className={classes.content}>
          {organizedCards.map(({ groupId, count, cardEntries }) => (
            <div>
              <div className={classes.groupHeader}>
                {groupMethods.header(groupId)}
                <span>{`(${count})`}</span>
                <i
                  style={{ marginLeft: "auto" }}
                  className={PrimeIcons.CHEVRON_UP}
                />
              </div>
              <ul>
                {cardEntries.map((cardEntry) => (
                  <li
                    key={cardEntry.card.name}
                    onMouseEnter={() => setHoverRow(cardEntry)}
                    onMouseLeave={() => setHoverRow(null)}
                    className={classes.listSeparator}
                  >
                    <Cell
                      row={cardEntry}
                      onSelectionChange={onSelectionChange}
                      selectedRows={selectedRows}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <HoverCard card={hoverRow?.card} />
    </>
  );
}
