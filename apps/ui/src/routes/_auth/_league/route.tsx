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
} from "@tanstack/react-router";
import { Avatar } from "primereact/avatar";
import { ContextMenu } from "primereact/contextmenu";
import type { MenuItem } from "primereact/menuitem";
import { classNames } from "primereact/utils";
import { useRef, useState, Suspense } from "react";

export const Route = createFileRoute("/_auth/_league")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // validate that league has been initialized
    const league = await queryClient.ensureQueryData(
      orpc.league.get.queryOptions(),
    );

    if (!league.initialized) throw redirect({ to: "/initialize" });

    // validate that you are a member & add role to context
    try {
      const membership = await queryClient.ensureQueryData(
        orpc.member.get.queryOptions({ input: { userId: context.user.id } }),
      );

      return {
        membership,
      };
    } catch (e) {
      if (e instanceof ORPCError && e.code === "NOT_FOUND") {
        throw redirect({});
      }
      throw e;
    }
  },
  loader: async () => {
    await queryClient.ensureQueryData(orpc.league.get.queryOptions());
    await queryClient.ensureQueryData(orpc.member.list.queryOptions());
  },
});

function RouteComponent() {
  const { user, membership } = Route.useRouteContext();

  const [modal, setModal] = useState<"settings" | "invite" | "trade" | null>(
    null,
  );
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const memberMenuRef = useRef<ContextMenu>(null);

  const { data: members } = useSuspenseQuery(orpc.member.list.queryOptions());

  const memberMenuItems: MenuItem[] = [
    { label: "Trade", command: () => setModal("trade") },
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.menu}>
          <nav>
            <ul>
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
                      to="/user/$userId/collection"
                      params={{ userId: member.user.id }}
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
