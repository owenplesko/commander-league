import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import classes from "./NewLeagueForm.module.css";
import { useState } from "react";
import { orpc } from "../lib/client";
import { useRouter } from "@tanstack/react-router";

type Props = {
  visible: boolean;
  onHide: () => void;
};

export function NewLeagueForm(props: Props) {
  const [name, setName] = useState<string>("");
  const router = useRouter();

  async function createLeague() {
    const res = await orpc.league.create({ name });
    props.onHide();
    router.navigate({ to: "/league/$leagueId", params: { leagueId: res.id } });
  }

  return (
    <Dialog header="New League" {...props}>
      <div className={classes.content}>
        <InputText
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button label="Create" onClick={createLeague} />
      </div>
    </Dialog>
  );
}
