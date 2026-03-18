import { createFileRoute } from "@tanstack/react-router";
import { orpc, queryClient } from "../../../../lib/client";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/decks/$userId",
)({
  component: RouteComponent,
  async loader({ params }) {
    await queryClient.ensureQueryData(
      orpc.deck.list.queryOptions({
        input: { leagueId: params.leagueId, userId: params.userId },
      }),
    );
  },
});

function RouteComponent() {
  return <div>{}</div>;
}
