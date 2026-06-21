import { PackOfferingTable } from "@/features/pack/components/PackOfferingTable";
import { orpc, queryClient } from "@/lib/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_league/packs")({
  component: RouteComponent,
  async loader() {
    await queryClient.ensureQueryData(orpc.pack.listOfferings.queryOptions());
  },
});

function RouteComponent() {
  const { data: offerings } = useSuspenseQuery(
    orpc.pack.listOfferings.queryOptions(),
  );
  return (
    <>
      <h1>Packs</h1>
      <PackOfferingTable offerings={offerings} />
    </>
  );
}
