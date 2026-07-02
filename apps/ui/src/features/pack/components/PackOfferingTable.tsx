import { PP } from "@/features/common/components/PackPoints";
import { orpc } from "@/lib/client";
import type {
  CardQuantity,
  PackOffering,
} from "@commander-league/contract/schemas";
import { useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PackContents } from "./PackContents";

export function PackOfferingTable({
  ppBalance,
  offerings,
}: {
  ppBalance?: number;
  offerings: PackOffering[];
}) {
  const mutation = useMutation(orpc.pack.openOffering.mutationOptions());
  const [packContents, setPackContents] = useState<CardQuantity[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const openPackTemplate = (value: PackOffering) => (
    <Button
      label="Open"
      text
      disabled={ppBalance !== undefined && ppBalance < value.cost}
      onClick={async () => {
        const packContents = await mutation.mutateAsync({
          packId: value.pack.id,
        });
        setPackContents(packContents);
        setVisible(true);
      }}
    />
  );

  const costTemplate = (value: PackOffering) => <PP packPoints={value.cost} />;

  return (
    <>
      <div className="card">
        <DataTable value={offerings}>
          <Column field="pack.name" header="Pack" sortable />
          <Column field="cost" body={costTemplate} header="Cost" sortable />
          <Column body={openPackTemplate} align="right" />
        </DataTable>
      </div>
      <PackContents
        visible={visible}
        onHide={() => setVisible(false)}
        packContents={packContents}
      />
    </>
  );
}
