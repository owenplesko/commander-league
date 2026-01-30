import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "../../lib/authClient";
import classes from "./route.module.css";
import { Avatar } from "primereact/avatar";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
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
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.logo}>Commander League</h1>
        <Avatar shape="circle" image={user.image ?? undefined} />
      </header>
      <main className={classes.main}>
        <Outlet />
      </main>
    </>
  );
}
