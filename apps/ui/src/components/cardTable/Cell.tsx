import classes from "./table.module.css";
import { classNames } from "primereact/utils";
import { selectedCardsReducer, type SelectedCard } from "./selection";
import type { CardQuantity } from "@commander-league/contract/schemas";

type SelectedCellContentsProps = {
  row: SelectedCard;
  selectedRows: SelectedCard[];
  onSelectionChange: (selection: SelectedCard[]) => void;
};

function SelectedCellContents({
  row,
  selectedRows,
  onSelectionChange,
}: SelectedCellContentsProps) {
  return (
    <>
      <span
        className={classes["text-ellipsis"]}
        style={{ marginRight: "auto" }}
      >
        {`${row.selectedQuantity}/${row.quantity} ${row.card.name}`}
      </span>
      {row.selectedQuantity > 1 ? (
        <i
          className="pi pi-sort-down-fill"
          onClick={() => {
            onSelectionChange(
              selectedCardsReducer(selectedRows, {
                type: "inc",
                cardName: row.card.name,
                delta: -1,
              }),
            );
          }}
        />
      ) : (
        <i className={classNames("pi pi-sort-down", classes.disabled)} />
      )}
      {row.selectedQuantity < row.quantity ? (
        <i
          className="pi pi-sort-up-fill"
          onClick={() => {
            onSelectionChange(
              selectedCardsReducer(selectedRows, {
                type: "inc",
                cardName: row.card.name,
                delta: 1,
              }),
            );
          }}
        />
      ) : (
        <i className={classNames("pi pi-sort-up", classes.disabled)} />
      )}
      <i
        className="pi pi-times"
        onClick={() => {
          onSelectionChange(
            selectedCardsReducer(selectedRows, {
              type: "unselect",
              cardName: row.card.name,
            }),
          );
        }}
      />
    </>
  );
}

type CellProps = {
  row: CardQuantity;
  selectedRows: SelectedCard[];
  onSelectionChange: (selection: SelectedCard[]) => void;
  onRowHover: (c: CardQuantity) => void;
};

export function Cell({
  row,
  selectedRows,
  onSelectionChange,
  onRowHover,
}: CellProps) {
  const selected = selectedRows?.find((r) => r.card.name === row.card.name);

  return (
    <div
      className={classNames(
        classes.item,
        selected ? classes.selected : undefined,
      )}
      onMouseEnter={onRowHover ? () => onRowHover(row) : undefined}
      onClick={
        selected
          ? undefined
          : () =>
              onSelectionChange(
                selectedCardsReducer(selectedRows, {
                  type: "select",
                  entry: row,
                }),
              )
      }
    >
      {selected ? (
        <SelectedCellContents
          row={selected}
          selectedRows={selectedRows}
          onSelectionChange={onSelectionChange}
        />
      ) : (
        <span className={classes["text-ellipsis"]}>
          {`${row.quantity} ${row.card.name}`}
        </span>
      )}
    </div>
  );
}
