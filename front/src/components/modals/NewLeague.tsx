import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import { useRouter } from "@tanstack/react-router";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function NewLeague({ visible, onHide }: Props) {
  const [name, setName] = useState<string>("");
  const router = useRouter();

  async function createLeague() {
    const res = await orpc.league.create({ name });
    onHide();
    router.navigate({ to: "/league/$leagueId", params: { leagueId: res.id } });
  }

  return (
    <Dialog
      header="New League"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={<Button label="Create" onClick={createLeague} />}
    >
      <div className="form">
        <div className="field">
          <label>League Name</label>
          <InputText
            placeholder="name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
