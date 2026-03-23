import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/league/$leagueId/")({
  beforeLoad: ({ params, context }) => {
    throw redirect({
      to: "/league/$leagueId/user/$userId/collection",
      params: { leagueId: params.leagueId, userId: context.user.id },
    });
  },
});
