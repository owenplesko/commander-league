import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "../../lib/authClient";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    const user = session.data?.user;

    if (!user) throw redirect({ to: "/login" });

    return {
      user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <header>
        <Button
          label="Logout"
          onClick={() => {
            authClient.signOut();
          }}
        />
        <Avatar image={user.image ?? undefined} />
      </header>
      <Outlet />
    </>
  );
}
