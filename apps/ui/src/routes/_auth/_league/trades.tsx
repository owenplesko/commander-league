import { orpc, queryClient } from "@/lib/client";
import type { TradeRequest } from "@commander-league/contract/schemas";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DataView } from "primereact/dataview";
import { TradeTableRow } from "@/features/trade/components/TradeTableRow";

export const Route = createFileRoute("/_auth/_league/trades")({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(orpc.trade.list.queryOptions());
  },
});

function RouteComponent() {
  const { data: trades } = useSuspenseQuery(orpc.trade.list.queryOptions());

  function tradeTemplate(trades: TradeRequest[]) {
    return (
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {trades.map((trade) => (
          <li key={trade.id}>
            <TradeTableRow trade={trade} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <h1>Trades</h1>
      <DataView value={trades} listTemplate={tradeTemplate} />
    </>
  );
}
