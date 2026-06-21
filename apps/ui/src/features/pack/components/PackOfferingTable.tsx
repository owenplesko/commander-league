import { PP } from "@/features/common/components/PackPoints";
import type { PackOffering } from "@commander-league/contract/schemas";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function PackOfferingTable({
  ppBalance,
  offerings,
}: {
  ppBalance?: number;
  offerings: PackOffering[];
}) {
  const openPackTemplate = (value: PackOffering) => (
    <Button
      label="Purchase"
      text
      disabled={ppBalance !== undefined && ppBalance < value.cost}
    />
  );

  const costTemplate = (value: PackOffering) => <PP packPoints={value.cost} />;

  return (
    <div className="card">
      <DataTable value={offerings}>
        <Column field="pack.name" header="Pack" sortable />
        <Column field="cost" body={costTemplate} header="Cost" sortable />
        <Column body={openPackTemplate} align="right" />
      </DataTable>
    </div>
  );
}
