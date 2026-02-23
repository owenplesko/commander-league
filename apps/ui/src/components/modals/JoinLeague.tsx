import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";
import { useMutation } from "@tanstack/react-query";
import { isDefinedError } from "@orpc/client";
import { Message } from "primereact/message";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function JoinLeague({ visible, onHide }: Props) {
  const [inviteCode, setInviteCode] = useState<string>("");
  const mutation = useMutation(orpc.league.join.mutationOptions());
  const notFound =
    !!mutation.error &&
    isDefinedError(mutation.error) &&
    mutation.error.code === "NOT_FOUND";

  const handleClose = () => {
    setInviteCode("");
    mutation.reset();
    onHide();
  };

  return (
    <Dialog
      header="Join League"
      visible={visible}
      onHide={handleClose}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      modal
      footer={
        <Button
          label="Join"
          onClick={() =>
            mutation.mutate({ inviteCode }, { onSuccess: handleClose })
          }
        />
      }
    >
      <div className="form">
        <div className="field">
          <label>Invite Code</label>
          <InputText
            placeholder="invite code..."
            invalid={notFound}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          {notFound && <Message severity="error" text="Invite code invalid" />}
        </div>
      </div>
    </Dialog>
  );
}
