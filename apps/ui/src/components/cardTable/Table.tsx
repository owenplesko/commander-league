import classes from "./table.module.css";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useMemo, useState } from "react";
import {
  type GroupOption,
  groupOptions,
  organizeCards,
  sortOptions,
  type CardGroup,
} from "./organize";
import { Cell } from "./Cell";
import type { CardQuantity } from "@commander-league/contract/schemas";
import { HoverCard } from "../HoverCard";
import { PrimeIcons } from "primereact/api";
import { minIndex } from "../../lib/utils";

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

  const groupBins = useMemo(() => {
    const columns = 3;
    const binSizes = new Array(columns).fill(0);
    const bins: CardGroup[][] = Array.from({ length: columns }, () => []);

    for (const group of organizedCards) {
      const binIndex = minIndex(binSizes);
      bins[binIndex]?.push(group);
      binSizes[binIndex]! += group.count + 1;
    }

    return bins;
  }, [organizedCards]);

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  function toggleGroup(groupId: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  }
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
        <div
          className={classes.contentBinContainer}
          style={{ gridTemplateColumns: `repeat(${3}, 1fr)` }}
        >
          {groupBins.map((groups) => (
            <div className={classes.contentBin}>
              {groups.map(({ groupId, count, cardEntries }) => {
                const collapsed = collapsedGroups.has(groupId);
                return (
                  <div>
                    <div
                      className={classes.groupHeader}
                      onClick={() => toggleGroup(groupId)}
                    >
                      {groupMethods.header(groupId)}
                      <span>{`(${count})`}</span>
                      <i
                        style={{ marginLeft: "auto" }}
                        className={
                          collapsed
                            ? PrimeIcons.CHEVRON_DOWN
                            : PrimeIcons.CHEVRON_UP
                        }
                      />
                    </div>
                    <div
                      className={`${classes.groupContent} ${collapsed ? classes.collapsed : ""}`}
                    >
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
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <HoverCard card={hoverRow?.card} />
    </>
  );
}
