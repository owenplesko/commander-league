import { createFileRoute, useRouter } from "@tanstack/react-router";
import { orpc, queryClient } from "../../../../../../../lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import classes from "./index.module.css";
import { Card } from "primereact/card";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/decks/",
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
  const { leagueId, userId } = Route.useParams();
  const { data: decks } = useSuspenseQuery(
    orpc.deck.list.queryOptions({ input: { leagueId, userId } }),
  );
  const router = useRouter();

  return (
    <div className={classes.deckGrid}>
      {decks.map((deck) => (
        <Card
          style={{ cursor: "pointer" }}
          onClick={() =>
            router.navigate({
              to: "/league/$leagueId/user/$userId/decks/$deckId",
              params: { leagueId, userId, deckId: deck.id },
            })
          }
          title={deck.name}
        />
      ))}
    </div>
  );
}
