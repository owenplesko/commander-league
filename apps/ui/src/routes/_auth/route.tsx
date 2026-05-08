import { authClient } from "@/lib/authClient";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
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
