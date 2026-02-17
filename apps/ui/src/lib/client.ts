import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

const link = new OpenAPILink(routes, {
  url: "http://localhost:5173/api",
});

export const orpc: RouterClient<typeof routes> = createORPCClient(link);
