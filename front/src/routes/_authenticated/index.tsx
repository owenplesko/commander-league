import { createFileRoute } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { orpc } from "../../lib/client";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  loader: async () => {
    const userLeagues = await orpc.league.list();
    return { leagues: userLeagues };
  },
});

function listTemplate(leagues: { id: number; name: string }[]) {
  return (
    <div>
      {leagues.map((league) => (
        <span>{league.name}</span>
      ))}
    </div>
  );
}

function RouteComponent() {
  const { leagues } = Route.useLoaderData();
  const [name, setName] = useState("");

  return (
    <>
      <InputText value={name} onChange={(e) => setName(e.target.value)} />
      <Button
        label="Create"
        onClick={() => {
          orpc.league.create({ name });
        }}
      />
      <DataView value={leagues} listTemplate={listTemplate} />
    </>
  );
}
