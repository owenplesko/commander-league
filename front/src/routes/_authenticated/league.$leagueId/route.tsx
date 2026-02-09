import classes from "./route.module.css";
import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
} from "@tanstack/react-router";
import z from "zod";
import { orpc } from "../../../lib/client";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { UserBadge } from "../../../components/UserBadge";

export const Route = createFileRoute("/_authenticated/league/$leagueId")({
  component: RouteComponent,
  params: z.object({ leagueId: z.coerce.number() }),
  loader: async ({ params }) => {
    const leaguePromise = orpc.league.get({ leagueId: params.leagueId });
    const leaguePlayersPromise = orpc.leaguePlayer.list({
      leagueId: params.leagueId,
    });

    const league = await leaguePromise;
    if (!league) throw notFound();

    const players = await leaguePlayersPromise;

    return { players, league };
  },
});

function RouteComponent() {
  const { players, league } = Route.useLoaderData();

  return (
    <div className={classes.wrapper}>
      <div className={classes.menu}>
        <div className={classNames(classes.header, classes.item)}>
          {league.name}
        </div>
        <nav>
          <ul>
            <li>
              <Link
                to="/league/$leagueId/shop"
                params={{ leagueId: league.id }}
                className={classNames(classes.item, classes.link)}
              >
                <i className="pi pi-shopping-bag" />
                Shop
              </Link>
            </li>
            <li className={classNames(classes.item, classes.link)}>
              <i className="pi pi-arrow-right-arrow-left" />
              Trades
            </li>
            <li className={classNames(classes.item, classes.link)}>
              <i className="pi pi-gift" />
              Wishlist
            </li>
          </ul>
        </nav>
        <nav>
          <strong className={classes.item}>Collections</strong>
          <ul>
            {players.map((player) => (
              <li>
                <Link
                  to="/league/$leagueId/collection/$playerId"
                  params={{ leagueId: league.id, playerId: player.id }}
                  className={classNames(classes.item, classes.link)}
                >
                  <Avatar
                    style={{ height: "1rem", width: "1rem" }}
                    shape="circle"
                    image={player.image ?? undefined}
                  />
                  {player.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={classes.output}>
        <Outlet />
      </div>
    </div>
  );
}
