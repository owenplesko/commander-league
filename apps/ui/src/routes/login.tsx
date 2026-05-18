import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "../lib/authClient";
import z from "zod";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { PrimeIcons } from "primereact/api";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: z.object({ callbackURL: z.url().optional() }),
});

function RouteComponent() {
  const { callbackURL } = Route.useSearch();

  function signIn() {
    authClient.signIn.social({
      provider: "discord",
      callbackURL,
    });
  }

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        flex: "1",
      }}
    >
      <Card title="Sign In Below">
        <Button
          icon={PrimeIcons.DISCORD}
          style={{ width: "100%" }}
          label="Continue with Discord"
          onClick={signIn}
        />
      </Card>
    </div>
  );
}
