import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/_league/deck/$deckId")({
  params: z.object({ userId: z.string(), deckId: z.coerce.number() }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/_league/deck/$deckId"!</div>;
}
