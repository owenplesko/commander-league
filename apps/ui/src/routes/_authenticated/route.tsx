import classes from "./route.module.css";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { authClient } from "../../lib/authClient";
import { UserBadge } from "../../components/UserBadge";
import { Menu } from "primereact/menu";
import { useRef } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();
    const user = session.data?.user;

    if (!user)
      throw redirect({
        to: "/login",
        search: {
          callbackURL: `${window.location.origin}${location.pathname}`,
        },
      });

    return {
      user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { user } = Route.useRouteContext();

  const menuRef = useRef<Menu | null>(null);

  const menuItems = [
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: async () => {
        await authClient.signOut();
        await router.invalidate();
      },
    },
  ];

  return (
    <>
      <Outlet />
      <div
        className={classes["auth-badge"]}
        onClick={(e) => menuRef.current?.toggle(e)}
      >
        <UserBadge user={user} />
      </div>
      <Menu popup ref={menuRef} model={menuItems} />
    </>
  );
}
