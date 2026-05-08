import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/purgatory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Welcome to purgatory. Ask an admin to add you to this league !</div>
  );
}
