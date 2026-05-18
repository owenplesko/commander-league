import { UserBadge } from "@/features/common/components/UserBadge";
import classes from "./route.module.css";
import { CreateTradeRequestModal } from "@/features/trade/components/CreateTradeModal";
import { orpc, queryClient } from "@/lib/client";
import type { Member } from "@commander-league/contract/schemas";
import { ORPCError } from "@orpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { Avatar } from "primereact/avatar";
import { ContextMenu } from "primereact/contextmenu";
import type { MenuItem } from "primereact/menuitem";
import { classNames } from "primereact/utils";
import { useRef, useState, Suspense } from "react";
import { authClient } from "@/lib/authClient";
import { Menu } from "primereact/menu";

export const Route = createFileRoute("/_auth/_league")({
  component: RouteComponent,
  beforeLoad: async () => {
    // validate that league has been initialized
    const league = await queryClient.ensureQueryData(
      orpc.league.get.queryOptions(),
    );

    if (!league.initialized) throw redirect({ to: "/initialize" });

    // validate that you are a member & add role to context
    const membership = await queryClient
      .ensureQueryData(orpc.member.me.queryOptions())
      .catch(() => null);

    if (!membership) throw redirect({ to: "/purgatory" });

    return { league, membership };
  },
  loader: async () => {
    await queryClient.ensureQueryData(orpc.league.get.queryOptions());
    await queryClient.ensureQueryData(orpc.member.list.queryOptions());
  },
});

function RouteComponent() {
  const router = useRouter();
  const { user, membership, league } = Route.useRouteContext();

  const [modal, setModal] = useState<"settings" | "invite" | "trade" | null>(
    null,
  );
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const memberMenuRef = useRef<ContextMenu>(null);
  const userMenuRef = useRef<Menu>(null);

  const { data: members } = useSuspenseQuery(orpc.member.list.queryOptions());

  const memberMenuItems: MenuItem[] = [
    {
      label: "Trade",
      command: () => setModal("trade"),
    },
  ];

  const userMenuItems: MenuItem[] = [
    {
      label: "Logout",
      command: async () => {
        await authClient.signOut();
        await router.invalidate();
      },
    },
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.menu}>
          <h1 className={classes.item}>{league.settings.name}</h1>
          <nav>
            <ul>
              {membership.admin && (
                <li>
                  <Link
                    to="/admin"
                    className={classNames(classes.item, classes.interactable)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/user/$userId/collection"
                  params={{ userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/user/$userId/decks"
                  params={{ userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Decks
                </Link>
              </li>
              <li>
                <Link
                  to="/trades"
                  params={{ userId: user.id }}
                  className={classNames(classes.item, classes.interactable)}
                >
                  Trades
                </Link>
              </li>
            </ul>
          </nav>
          <nav>
            <strong className={classes.item}>Members</strong>
            <ul>
              {members.length === 1 ? (
                <span
                  className={classes.item}
                  style={{ color: "var(--text-color-secondary)" }}
                >
                  nobody here... :(
                </span>
              ) : (
                members
                  .filter((member) => member.user.id !== user.id)
                  .map((member) => (
                    <li
                      onContextMenu={(e) => {
                        setSelectedMember(member);
                        memberMenuRef.current?.show(e);
                      }}
                    >
                      <Link
                        to="/user/$userId/collection"
                        params={{ userId: member.user.id }}
                        className={classNames(
                          classes.item,
                          classes.interactable,
                        )}
                      >
                        <Avatar
                          style={{ height: "1rem", width: "1rem" }}
                          shape="circle"
                          image={member.user.image ?? undefined}
                        />
                        {member.user.name}
                      </Link>
                    </li>
                  ))
              )}
            </ul>
          </nav>
          <div
            style={{ marginTop: "auto" }}
            className={classNames(classes.item, classes.interactable)}
            onClick={(e) => userMenuRef.current?.toggle(e)}
          >
            <UserBadge user={user} />
          </div>
        </div>
        <div className={classes.output}>
          <Outlet />
        </div>
      </div>
      <Menu popup ref={userMenuRef} model={userMenuItems} />
      <ContextMenu ref={memberMenuRef} model={memberMenuItems} />
      <Suspense>
        {selectedMember && (
          <CreateTradeRequestModal
            requester={membership}
            recipient={selectedMember}
            visible={modal === "trade"}
            onHide={() => setModal(null)}
          />
        )}
      </Suspense>
    </>
  );
}
