import classes from "./route.module.css";
import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import { orpc, queryClient } from "../../../lib/client";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";
import { LeagueSettings } from "../../../components/modals/LeagueSettings";
import { InviteCode } from "../../../components/modals/InviteCode";
import { confirmDialog } from "primereact/confirmdialog";
import {
  useMutation,
  useQueries,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/league/$leagueId")({
  component: RouteComponent,
  params: z.object({ leagueId: z.coerce.number() }),
  beforeLoad: async ({ params }) => {
    const league = await queryClient.ensureQueryData(
      orpc.league.get.queryOptions({ input: { leagueId: params.leagueId } }),
    );

    if (!league) throw notFound();
  },
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(
      orpc.league.member.list.queryOptions({
        input: { leagueId: params.leagueId },
      }),
    );
  },
});

function RouteComponent() {
  const { leagueId } = Route.useParams();
  const { user } = Route.useRouteContext();

  const router = useRouter();
  const menuRef = useRef<Menu>(null);
  const [modal, setModal] = useState<"settings" | "invite" | null>(null);

  const { data: league } = useSuspenseQuery(
    orpc.league.get.queryOptions({ input: { leagueId } }),
  );

  const { data: members } = useSuspenseQuery(
    orpc.league.member.list.queryOptions({ input: { leagueId } }),
  );

  const membership = members.find((member) => member.user.id === user.id);

  const leaveMutation = useMutation(
    orpc.league.member.delete.mutationOptions({
      onSuccess: (_output, _input, _err, ctx) => {
        ctx.client.invalidateQueries({ queryKey: orpc.league.list.key() });
        router.navigate({ to: "/" });
      },
    }),
  );

  const deleteMutation = useMutation(
    orpc.league.delete.mutationOptions({
      onSuccess: (_output, _input, _err, ctx) => {
        ctx.client.invalidateQueries({ queryKey: orpc.league.list.key() });
        router.navigate({ to: "/" });
      },
    }),
  );

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
    membership?.role === "owner"
      ? {
          label: "Delete",
          icon: PrimeIcons.TRASH,
          command: () => {
            confirmDialog({
              header: "Confirm",
              message: "Are you sure you want to delete this league?",
              defaultFocus: "reject",
              acceptClassName: "p-button-danger",
              icon: PrimeIcons.EXCLAMATION_TRIANGLE,
              accept: () => {
                deleteMutation.mutate({ leagueId: league.id });
              },
            });
          },
        }
      : {
          label: "Leave",
          icon: PrimeIcons.SIGN_OUT,
          command: () => {
            confirmDialog({
              header: "Confirm",
              message: "Are you sure you want to leave this league?",
              defaultFocus: "reject",
              acceptClassName: "p-button-danger",
              icon: PrimeIcons.EXCLAMATION_TRIANGLE,
              accept: () => {
                leaveMutation.mutate({
                  leagueId: league.id,
                  userId: user.id,
                });
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
        league={league}
        visible={modal === "settings"}
        onHide={() => setModal(null)}
      />
      <InviteCode
        leagueId={leagueId}
        visible={modal === "invite"}
        onHide={() => setModal(null)}
      />
    </>
  );
}
