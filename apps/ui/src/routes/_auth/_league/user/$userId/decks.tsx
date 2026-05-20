import { DeckListActions } from "@/features/deck/components/DeckListActions";
import classes from "./deck.module.css";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Card } from "primereact/card";
import { scryfallArtCropUrl } from "@/lib/utils";

export const Route = createFileRoute("/_auth/_league/user/$userId/decks")({
  component: RouteComponent,
  loader: async ({ params: { userId } }) => {
    await queryClient.ensureQueryData(
      orpc.member.get.queryOptions({ input: { userId } }),
    );
    await queryClient.ensureQueryData(
      orpc.deck.list.queryOptions({ input: { userId } }),
    );
  },
});

function RouteComponent() {
  const router = useRouter();
  const { userId } = Route.useParams();

  const { data: member } = useSuspenseQuery(
    orpc.member.get.queryOptions({ input: { userId } }),
  );
  const { data: decks } = useSuspenseQuery(
    orpc.deck.list.queryOptions({ input: { userId } }),
  );

  return (
    <>
      <h1>{`${member.user.name}'s Decks`}</h1>
      <DeckListActions member={member} />
      <div className={classes.deckGrid}>
        {decks.map((deck) => (
          <div
            className="card"
            style={{
              cursor: "pointer",
              backgroundImage: `
              url(${scryfallArtCropUrl(
                deck.commanderCard.data.printings[0]!.scryfallId,
              )})`,
              backgroundSize: "cover",
            }}
            onClick={() =>
              router.navigate({
                to: "/deck/$deckId",
                params: { deckId: deck.id },
              })
            }
          >
            <strong>{deck.name}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
