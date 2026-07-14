import { OnboardingCard } from "@/features/admin/components/OnboardingCard";
import { PackOfferings } from "@/features/admin/components/PackOfferings";
import { PPDistributor } from "@/features/admin/components/PPDistributor";
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <OnboardingCard />
      <PackOfferings />
      <PPDistributor />
    </div>
  );
}
