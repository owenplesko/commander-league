import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/decks/$deckId",
)({
  params: z.object({ userId: z.string(), deckId: z.coerce.number() }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated/league/$leagueId/user/$userId/decks/$deckId"!
    </div>
  );
}
