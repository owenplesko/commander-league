import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/league/")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
