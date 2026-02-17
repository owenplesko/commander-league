import classes from "./InviteCode.module.css";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Dialog } from "primereact/dialog";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function InviteCode({ visible, onHide }: Props) {
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
        <div className="field">
          <label>Invite Code</label>
          <div className={classes["invite-code"]}>
            <strong style={{ flexGrow: 1 }}>xxx-xxx-xxx</strong>
            <ButtonGroup>
              <Button text icon="pi pi-clone" />
              <Button text icon="pi pi-sync" />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
