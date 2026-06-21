import type { PackOffering } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function PackOfferingTable({
  offerings,
}: {
  offerings: PackOffering[];
}) {
  const openPackTemplate = (value: PackOffering) => (
    <Button label="Purchase" text />
  );

  return (
    <div className="card">
      <DataTable value={offerings}>
        <Column field="pack.name" header="Pack" sortable />
        <Column field="cost" header="Cost" sortable />
        <Column body={openPackTemplate} align="right" />
      </DataTable>
    </div>
  );
}
