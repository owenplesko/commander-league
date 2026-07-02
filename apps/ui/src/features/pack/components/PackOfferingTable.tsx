import { PP } from "@/features/common/components/PackPoints";
import { orpc } from "@/lib/client";
import type {
  PackOffering,
  PackOpening,
} from "@commander-league/contract/schemas";
import { useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PackOpeningModal } from "./PackOpeningModal";

export function PackOfferingTable({
  ppBalance,
  offerings,
}: {
  ppBalance?: number;
  offerings: PackOffering[];
}) {
  const mutation = useMutation(orpc.pack.openOffering.mutationOptions());
  const [packOpening, setPackOpening] = useState<PackOpening>();
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
        setPackOpening(packContents);
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
      {packOpening && (
        <PackOpeningModal
          visible={visible}
          onHide={() => setVisible(false)}
          packOpening={packOpening}
        />
      )}
    </>
  );
}
