import classes from "./deck.module.css";
import { NewDeck } from "@/features/deck/components/NewDeckModal";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";

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
  const { user: self } = Route.useRouteContext();
  const isSelf = userId === self.id;

  const { data: member } = useSuspenseQuery(
    orpc.member.get.queryOptions({ input: { userId } }),
  );
  const { data: decks } = useSuspenseQuery(
    orpc.deck.list.queryOptions({ input: { userId } }),
  );

  const [modal, setModal] = useState<"create" | null>(null);

  return (
    <>
      {isSelf && (
        <Button
          style={{ marginRight: "auto" }}
          label="New"
          onClick={() => setModal("create")}
        />
      )}
      <div className={classes.deckGrid}>
        {decks.map((deck) => (
          <Card
            style={{ cursor: "pointer" }}
            onClick={() =>
              router.navigate({
                to: "/deck/$deckId",
                params: { deckId: deck.id },
              })
            }
            title={deck.name}
          />
        ))}
      </div>
      <NewDeck
        member={member}
        visible={modal === "create"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
