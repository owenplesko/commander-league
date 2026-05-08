import classes from "./index.module.css";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { orpc, queryClient } from "../../lib/client";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Button } from "primereact/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NewLeagueModal } from "../../features/league/components/NewLeagueModal";
import { JoinLeagueModal } from "../../features/league/components/JoinLeagueModal";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,

  loader: async () => {
    await queryClient.ensureQueryData(orpc.league.list.queryOptions());
  },
});

function RouteComponent() {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "join" | null>(null);
  const { data: leagues } = useSuspenseQuery(orpc.league.list.queryOptions());

  return (
    <>
      <div className={classes["league-grid"]}>
        {leagues.map((league) => (
          <div
            className={classes.card}
            onClick={() => {
              router.navigate({
                to: "/league/$leagueId",
                params: { leagueId: league.id },
              });
            }}
          >
            <div className={classes["card-header"]}>{league.name}</div>
          </div>
        ))}
        <div className={classNames(classes.card, classes.new)}>
          <div className={classes.actions}>
            <Button text label="Join League" onClick={() => setModal("join")} />
            <Button
              text
              severity="secondary"
              label="Create League"
              onClick={() => setModal("create")}
            />
          </div>
        </div>
      </div>
      <NewLeagueModal
        visible={modal === "create"}
        onHide={() => setModal(null)}
      />
      <JoinLeagueModal
        visible={modal === "join"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
