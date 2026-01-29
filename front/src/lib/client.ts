import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { routes } from "../../../back/src/routes/";

const link = new OpenAPILink(routes, {
  url: "http://localhost:5173/api",
});

export const orpc: RouterClient<typeof routes> = createORPCClient(link);
