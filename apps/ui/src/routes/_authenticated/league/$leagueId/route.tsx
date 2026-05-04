import classes from "./route.module.css";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { Suspense, useRef, useState } from "react";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type { LeagueMember } from "@commander-league/contract/schemas";
import { ContextMenu } from "primereact/contextmenu";
import { InviteCode } from "../../../../components/modals/InviteCode";
import { queryClient, orpc } from "../../../../lib/client";
import { CreateTradeRequestModal } from "../../../../components/modals/CreateTradeModal";
import { LeagueSettingsModal } from "../../../../features/league/components/LeagueSettingsModal";

export const Route = createFileRoute("/_authenticated/league/$leagueId")({
  component: RouteComponent,
  params: z.object({ leagueId: z.coerce.number() }),
  beforeLoad: async ({ params, context }) => {
    try {
      const leagueMembership = await queryClient.ensureQueryData(
        orpc.league.member.get.queryOptions({
          input: { leagueId: params.leagueId, userId: context.user.id },
        }),
      );
      return { leagueMembership };
    } catch {
      throw redirect({ to: "/" });
    }
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
  const { user, leagueMembership } = Route.useRouteContext();

  const router = useRouter();
  const leagueMenuRef = useRef<Menu>(null);
  const memberMenuRef = useRef<ContextMenu>(null);
  const [modal, setModal] = useState<"settings" | "invite" | "trade" | null>(
    null,
  );
  const [selectedMember, setSelectedMember] = useState<LeagueMember | null>(
    null,
  );

  const { data: league } = useSuspenseQuery(
    orpc.league.get.queryOptions({ input: { leagueId } }),
  );

  const { data: members } = useSuspenseQuery(
    orpc.league.member.list.queryOptions({ input: { leagueId } }),
  );

  const leaveLeague = useMutation(
    orpc.league.member.delete.mutationOptions({
      onSuccess: (_output, _input, _err, ctx) => {
        ctx.client.invalidateQueries({ queryKey: orpc.league.list.key() });
        router.navigate({ to: "/" });
      },
    }),
  );

  const kickMember = useMutation(
    orpc.league.member.delete.mutationOptions({
      onSuccess: (_output, _input, _err, ctx) => {
        ctx.client.invalidateQueries({
          queryKey: orpc.league.member.list.key({ input: { leagueId } }),
        });
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

  const leagueMenuItems: MenuItem[] =
    leagueMembership?.role === "owner"
      ? [
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
          },
        ]
      : [
          {
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
                  leaveLeague.mutate({
                    leagueId: league.id,
                    userId: user.id,
                  });
                },
              });
            },
          },
        ];

  const adminMenuItems: MenuItem[] = [
    {
      label: "Kick",
      command: () => {
        if (!selectedMember) return;
        kickMember.mutate({ leagueId, userId: selectedMember.user.id });
      },
    },
  ];

  const memberMenuItems: MenuItem[] = [
    { label: "Trade", command: () => setModal("trade") },
    ...(leagueMembership?.role === "owner" ? adminMenuItems : []),
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
            onClick={(e) => leagueMenuRef.current?.toggle(e)}
          >
            {league.name}
          </div>
          <nav>
            <ul>
              <li>
                <Link
                  to="/league/$leagueId/user/$userId/collection"
                  params={{ leagueId: league.id, userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/league/$leagueId/user/$userId/decks"
                  params={{ leagueId: league.id, userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Decks
                </Link>
              </li>
              <li>
                <Link
                  to="/league/$leagueId/user/$userId/trades"
                  params={{ leagueId: league.id, userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Trades
                </Link>
              </li>
            </ul>
          </nav>
          <nav>
            <strong className={classes.item}>Players</strong>
            <ul>
              {members
                .filter((member) => member.user.id !== user.id)
                .map((member) => (
                  <li
                    onContextMenu={(e) => {
                      setSelectedMember(member);
                      memberMenuRef.current?.show(e);
                    }}
                  >
                    <Link
                      to="/league/$leagueId/user/$userId/collection"
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
      <ContextMenu ref={memberMenuRef} model={memberMenuItems} />
      <Menu popup ref={leagueMenuRef} model={leagueMenuItems} />
      <Suspense>
        {leagueMembership?.role === "owner" && (
          <>
            <InviteCode
              leagueId={leagueId}
              visible={modal === "invite"}
              onHide={() => setModal(null)}
            />

            <LeagueSettingsModal
              leagueId={leagueId}
              visible={modal === "settings"}
              onHide={() => setModal(null)}
            />
          </>
        )}
        {selectedMember && (
          <CreateTradeRequestModal
            requester={user}
            recipient={selectedMember?.user}
            leagueId={leagueId}
            visible={modal === "trade"}
            onHide={() => setModal(null)}
          />
        )}
      </Suspense>
    </>
  );
}
