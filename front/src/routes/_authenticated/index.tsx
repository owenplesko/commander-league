import classes from "./index.module.css";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { orpc } from "../../lib/client";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { NewLeague } from "../../components/modals/NewLeague";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,

  loader: async () => {
    const userLeagues = await orpc.league.list();
    return { leagues: userLeagues };
  },
});

function RouteComponent() {
  const { leagues } = Route.useLoaderData();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

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
        <div
          className={classNames(classes.card, classes.new)}
          onClick={() => setVisible(true)}
        >
          <i className="pi pi-plus" />
        </div>
      </div>
      <NewLeague visible={visible} onHide={() => setVisible(false)} />
    </>
  );
}
