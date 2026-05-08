import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "../lib/authClient";
import z from "zod";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: z.object({ callbackURL: z.url().optional() }),
});

function RouteComponent() {
  const { callbackURL } = Route.useSearch();

  useEffect(() => {
    authClient.signIn.social({
      provider: "discord",
      callbackURL,
    });
  }, []);

  return <div>Redirecting to Discord...</div>;
}
