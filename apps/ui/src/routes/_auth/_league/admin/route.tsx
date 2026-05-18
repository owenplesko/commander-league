import { OnboardingCard } from "@/features/admin/components/OnboardingCard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_league/admin")({
  beforeLoad: ({ context: { membership, league, user } }) => {
    const isAdmin = membership.admin;
    const isOwner = league.settings.ownerId === user.id;

    if (!(isAdmin || isOwner)) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <OnboardingCard />
    </div>
  );
}
