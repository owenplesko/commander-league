import classes from "./index.module.css";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { orpc } from "../../lib/client";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";

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

  return (
    <div className={classes["league-grid"]}>
      {leagues.map((league) => (
        <Card
          className={classes["league-card"]}
          title={league.name}
          onClick={() => {
            router.navigate({
              to: "/league/$leagueId",
              params: { leagueId: league.id },
            });
          }}
        ></Card>
      ))}
      <div
        className={classNames(
          classes["league-card"],
          classes["new-league-card"],
        )}
      >
        <i className="pi pi-plus" />
      </div>
    </div>
  );
}
