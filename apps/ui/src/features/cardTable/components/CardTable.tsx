import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import classes from "../styles/Table.module.css";
import { useState } from "react";
import type { GroupingMethods } from "../types/cardGrouping";
import { groupByColor, groupingOptions } from "../options/groupingOptions";
import type { CardQuantity } from "@commander-league/contract/schemas";
import { useCardGrouping } from "../hooks/useCardGrouping";
import { Body } from "./Body";
import { sortByName, sortingOptions } from "../options/sortingOptions";
import type { CardSortingMethods } from "../types/cardSorting";

export function CardTable({
  cardQuantities,
}: {
  cardQuantities: CardQuantity[];
}) {
  const [groupingMethods, setGroupingMethods] =
    useState<GroupingMethods<any>>(groupByColor);
  const [sortingMethods, setSortingMethods] =
    useState<CardSortingMethods>(sortByName);

  const cardGroups = useCardGrouping({
    cardQuantities,
    groupMethods: groupingMethods,
    sortBy: sortingMethods,
  });

  return (
    <div className="card">
      <div className={classes.header}>
        <FloatLabel>
          <Dropdown
            options={groupingOptions}
            value={groupingMethods}
            onChange={(e) => setGroupingMethods(e.value)}
            optionLabel="label"
            optionValue="methods"
            variant="filled"
          />
          <label>Group by:</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            options={sortingOptions}
            value={sortingMethods}
            onChange={(e) => setSortingMethods(e.value)}
            optionLabel="label"
            optionValue="methods"
            variant="filled"
          />
          <label>Sort by:</label>
        </FloatLabel>
      </div>
      <Body cardGroups={cardGroups} />
    </div>
  );
}
