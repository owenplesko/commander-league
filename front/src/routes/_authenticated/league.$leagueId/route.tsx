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
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

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
  const [modal, setModal] = useState<"settings" | null>(null);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.menu}>
          <div className={classNames(classes.header, classes.item)}>
            {league.name}
          </div>
          <nav>
            <ul>
              <li>
                <div
                  className={classNames(classes.item, classes.link)}
                  onClick={() => setModal("settings")}
                >
                  <i className="pi pi-cog" />
                  Settings
                </div>
              </li>
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
      <Dialog
        header="Settings"
        visible={modal === "settings"}
        onHide={() => setModal(null)}
        style={{ width: "40rem" }}
        draggable={false}
        resizable={false}
        modal
      >
        <div className="form">
          <div className="field">
            <label>Invite Code</label>
            <div className={classes["invite-code"]}>
              <strong style={{ flexGrow: 1 }}>xxx-xxx-xxx</strong>
              <ButtonGroup>
                <Button text icon="pi pi-clone" />
                <Button text icon="pi pi-sync" />
              </ButtonGroup>
            </div>
          </div>
          <div className="field">
            <label>League Name</label>
            <InputText
              variant="outlined"
              value={league.name}
              placeholder="league name..."
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
