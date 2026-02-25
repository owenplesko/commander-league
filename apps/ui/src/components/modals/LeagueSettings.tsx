import { useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import type { League } from "@commander-league/contract/schemas";

type Props = {
  league: League;
  visible: boolean;
  onHide: () => void;
};

export function LeagueSettings({ league, visible, onHide }: Props) {
  const [leagueName, setLeagueName] = useState(league.name);

  const saveMutation = useMutation(
    orpc.league.update.mutationOptions({
      onSuccess: (_output, _input, _err, ctx) => {
        ctx.client.invalidateQueries({
          queryKey: orpc.league.get.key({ input: { leagueId: league.id } }),
        });
        onHide();
      },
    }),
  );

  return (
    <Dialog
      header="Settings"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      footer={
        <div>
          <Button text>Reset</Button>
          <Button
            onClick={() => {
              saveMutation.mutate({ leagueId: league.id, name: leagueName });
            }}
          >
            Save
          </Button>
        </div>
      }
      modal
    >
      <div className="form">
        <div className="field">
          <label>League Name</label>
          <InputText
            variant="outlined"
            value={leagueName}
            placeholder="league name..."
            onChange={(e) => setLeagueName(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
