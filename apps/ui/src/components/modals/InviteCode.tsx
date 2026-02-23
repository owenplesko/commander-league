import { useRouteContext } from "@tanstack/react-router";
import { Dialog } from "primereact/dialog";
import { orpc } from "../../lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { InviteCode } from "../../../../../packages/contract/src/schemas/inviteCode";
import { InputSwitch } from "primereact/inputswitch";
import { MAX_INVITE_COUNT } from "@commander-league/contract/constants";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function InviteCode({ visible, onHide }: Props) {
  const { league } = useRouteContext({
    from: "/_authenticated/league/$leagueId",
  });

  const { data: inviteCodes } = useQuery(
    orpc.league.inviteCode.list.queryOptions({
      input: { leagueId: league.id },
    }),
  );

  const creationMutation = useMutation(
    orpc.league.inviteCode.create.mutationOptions(),
  );

  const updateMutation = useMutation(
    orpc.league.inviteCode.update.mutationOptions(),
  );

  const deleteMutation = useMutation(
    orpc.league.inviteCode.delete.mutationOptions(),
  );

  if (!inviteCodes) return null;

  return (
    <Dialog
      header="Invites"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
    >
      <div className="form">
        <DataTable value={inviteCodes} size={"small"}>
          <Column field="code" header="Code" />
          <Column field="uses" header="Uses" />
          <Column
            field="active"
            header="Active"
            body={(rowData: InviteCode) => (
              <InputSwitch
                checked={rowData.active}
                onChange={(e) =>
                  updateMutation.mutate({
                    leagueId: rowData.leagueId,
                    code: rowData.code,
                    active: e.value,
                  })
                }
              />
            )}
          />
          <Column
            header="Delete"
            body={(rowData: InviteCode) => (
              <Button
                text
                severity="danger"
                icon={PrimeIcons.TRASH}
                onClick={() =>
                  deleteMutation.mutate({
                    leagueId: rowData.leagueId,
                    code: rowData.code,
                  })
                }
              />
            )}
          />
        </DataTable>
        <Button
          text
          style={{ marginLeft: "auto" }}
          label="Generate New Code"
          disabled={inviteCodes.length >= MAX_INVITE_COUNT}
          onClick={() => {
            creationMutation.mutate({ leagueId: league.id });
          }}
        />
      </div>
    </Dialog>
  );
}
