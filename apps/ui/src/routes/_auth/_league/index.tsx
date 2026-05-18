import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_league/")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/user/$userId/collection",
      params: { userId: context.user.id },
    });
  },
});
