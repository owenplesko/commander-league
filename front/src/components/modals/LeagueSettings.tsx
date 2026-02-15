import { useRouteContext } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function LeagueSettings({ visible, onHide }: Props) {
  const { league } = useRouteContext({
    from: "/_authenticated/league/$leagueId",
  });

  const [leagueName, setLeagueName] = useState(league.name);

  async function save() {
    await orpc.league.update({ leagueId: league.id, name: leagueName });
  }

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
            onClick={async () => {
              await save();
              onHide();
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
