import classes from "./table.module.css";
import { classNames } from "primereact/utils";
import { selectedCardsReducer } from "./selection";
import type { CardQuantity } from "@commander-league/contract/schemas";

type SelectedCellContentsProps = {
  row: CardQuantity;
  selectedRows: CardQuantity[];
  selectedQuantity: number;
  onSelectionChange: (selection: CardQuantity[]) => void;
};

function SelectedCellContents({
  row,
  selectedRows,
  selectedQuantity,
  onSelectionChange,
}: SelectedCellContentsProps) {
  return (
    <>
      <span
        className={classes["text-ellipsis"]}
        style={{ marginRight: "auto" }}
      >
        {`${selectedQuantity}/${row.quantity} ${row.card.name}`}
      </span>
      {selectedQuantity > 1 ? (
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
      {selectedQuantity < row.quantity ? (
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
  selectedRows: CardQuantity[];
  onSelectionChange: (selection: CardQuantity[]) => void;
};

export function Cell({ row, selectedRows, onSelectionChange }: CellProps) {
  const selected = selectedRows?.find((r) => r.card.name === row.card.name);

  return (
    <div
      className={classNames(
        classes.item,
        selected ? classes.selected : undefined,
      )}
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
          row={row}
          selectedRows={selectedRows}
          selectedQuantity={selected.quantity}
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
