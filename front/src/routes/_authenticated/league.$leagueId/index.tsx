import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_authenticated/league/$leagueId/")({
  component: RouteComponent,
  params: z.object({ leagueId: z.coerce.number() }),
});

function RouteComponent() {
  return <div>Hello "/_authenticated/league/$leagueId/"!</div>;
}
