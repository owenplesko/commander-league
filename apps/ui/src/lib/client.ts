import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@commander-league/contract";

const link = new OpenAPILink(contract, {
  url: "http://localhost:5173/api",
});

type Client = JsonifiedClient<ContractRouterClient<typeof contract>>;

export const client: Client = createORPCClient(link);
