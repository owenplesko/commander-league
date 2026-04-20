import classes from "./collection.module.css";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { CardTable } from "../../../../../../components/cardTable/Table";
import { CollectionBulkEditModal } from "../../../../../../components/modals/CollectionBulkEdit";
import { queryClient, orpc } from "../../../../../../lib/client";
import { scryfallImgUrl } from "../../../../../../lib/utils";
import type { CardQuantity } from "@commander-league/contract/schemas";

export const Route = createFileRoute(
  "/_authenticated/league/$leagueId/user/$userId/collection",
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      await queryClient.ensureQueryData(
        orpc.league.member.get.queryOptions({
          input: { leagueId: params.leagueId, userId: params.userId },
        }),
      );
    } catch {
      throw redirect({ to: "/league/$leagueId", params });
    }

    await queryClient.ensureQueryData(
      orpc.collection.get.queryOptions({
        input: { leagueId: params.leagueId, userId: params.userId },
      }),
    );
  },
});

function RouteComponent() {
  const { leagueId, userId } = Route.useParams();

  const { data: member } = useSuspenseQuery(
    orpc.league.member.get.queryOptions({ input: { leagueId, userId } }),
  );
  const { data: collection } = useSuspenseQuery(
    orpc.collection.get.queryOptions({ input: { leagueId, userId } }),
  );

  const [modal, setModal] = useState<"bulk-edit" | null>(null);

  return (
    <>
      <h1>{`${member.user.name}'s Collection`}</h1>
      <Button
        style={{ marginRight: "auto" }}
        label="Bulk Edit"
        onClick={() => {
          setModal("bulk-edit");
        }}
      />
      <div className={classes.layout}>
        <div className="card">
          <CardTable cards={collection.cardQuantities} />
        </div>
      </div>
      <CollectionBulkEditModal
        collection={collection}
        userId={userId}
        leagueId={leagueId}
        visible={modal === "bulk-edit"}
        onHide={() => {
          setModal(null);
        }}
      />
    </>
  );
}
