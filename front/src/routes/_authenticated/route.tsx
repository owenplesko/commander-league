import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "../../lib/authClient";
import { Avatar } from "primereact/avatar";
import classes from "./route.module.css";

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
    <div className={classes.page}>
      <header>
        <Avatar shape="circle" image={user.image ?? undefined} />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>feet</footer>
    </div>
  );
}
