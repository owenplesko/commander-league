import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "../../lib/authClient";
import { UserBadge } from "../../components/UserBadge";

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
  const { user } = Route.useRouteContext();

  return (
    <>
      <Outlet />
      <UserBadge user={user} />
    </>
  );
}
