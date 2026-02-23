import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function JoinLeague({ visible, onHide }: Props) {
  const [inviteCode, setInviteCode] = useState<string>("");

  const mutation = useMutation(orpc.league.join.mutationOptions());

  return (
    <Dialog
      header="Join League"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={
        <Button
          label="Join"
          onClick={() => mutation.mutate({ inviteCode }, { onSuccess: onHide })}
        />
      }
    >
      <div className="form">
        <div className="field">
          <label>Invite Code</label>
          <InputText
            placeholder="invite code..."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
