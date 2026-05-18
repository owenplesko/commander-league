import { orpc, queryClient } from "@/lib/client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/purgatory")({
  component: RouteComponent,
  beforeLoad: async () => {
    const member = await queryClient
      .ensureQueryData(orpc.member.me.queryOptions())
      .catch(() => null);

    if (member !== null) throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  return (
    <h1 style={{ textAlign: "center" }}>
      Welcome to purgatory.
      <br /> Ask an admin to onboard you!
    </h1>
  );
}
