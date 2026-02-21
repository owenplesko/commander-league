import classes from "./route.module.css";
import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import { client } from "../../../lib/client";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";
import { LeagueSettings } from "../../../components/modals/LeagueSettings";
import { InviteCode } from "../../../components/modals/InviteCode";
import { confirmDialog } from "primereact/confirmdialog";

export const Route = createFileRoute("/_authenticated/league/$leagueId")({
  component: RouteComponent,
  params: z.object({ leagueId: z.coerce.number() }),
  beforeLoad: async ({ params }) => {
    const league = await client.league.get({ leagueId: params.leagueId });

    if (!league) throw notFound();

    return { league };
  },
  loader: async ({ params, context }) => {
    const members = await client.league.member.list({
      leagueId: params.leagueId,
    });

    return { members, league: context.league };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { members, league } = Route.useLoaderData();
  const menuRef = useRef<Menu>(null);
  const [modal, setModal] = useState<"settings" | "invite" | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Invite Code",
      icon: PrimeIcons.USER_PLUS,
      command: () => setModal("invite"),
    },
    {
      label: "Settings",
      icon: PrimeIcons.COG,
      command: () => {
        setModal("settings");
      },
    },
    {
      label: "Delete",
      icon: PrimeIcons.TRASH,
      command: () => {
        confirmDialog({
          header: "Delete Confirmation",
          message: "Are you sure you want to delete this league?",
          defaultFocus: "reject",
          acceptClassName: "p-button-danger",
          icon: PrimeIcons.EXCLAMATION_TRIANGLE,
          accept: async () => {
            await client.league.delete({ leagueId: league.id });
            router.navigate({ to: "/" });
          },
        });
      },
    },
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.menu}>
          <div
            className={classNames(
              classes.header,
              classes.item,
              classes.interactable,
            )}
            onClick={(e) => menuRef.current?.toggle(e)}
          >
            {league.name}
          </div>
          <nav>
            <ul>
              <li>
                <Link
                  to="/league/$leagueId/shop"
                  params={{ leagueId: league.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  <i className="pi pi-shopping-bag" />
                  Shop
                </Link>
              </li>
              <li className={classNames(classes.item, classes.interactable)}>
                <i className="pi pi-arrow-right-arrow-left" />
                Trades
              </li>
              <li className={classNames(classes.item, classes.interactable)}>
                <i className="pi pi-gift" />
                Wishlist
              </li>
            </ul>
          </nav>
          <nav>
            <strong className={classes.item}>Collections</strong>
            <ul>
              {members.map((member) => (
                <li>
                  <Link
                    to="/league/$leagueId/collection/$userId"
                    params={{ leagueId: league.id, userId: member.user.id }}
                    className={classNames(classes.item, classes.interactable)}
                  >
                    <Avatar
                      style={{ height: "1rem", width: "1rem" }}
                      shape="circle"
                      image={member.user.image ?? undefined}
                    />
                    {member.user.name}
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
      <Menu popup ref={menuRef} model={menuItems} />
      <LeagueSettings
        visible={modal === "settings"}
        onHide={() => setModal(null)}
      />
      <InviteCode visible={modal === "invite"} onHide={() => setModal(null)} />
    </>
  );
}
