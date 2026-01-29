import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "../lib/authClient";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    authClient.signIn.social({
      provider: "discord",
      callbackURL: "http://localhost:5173",
    });
  }, []);

  return <div>Redirecting to Discord...</div>;
}
