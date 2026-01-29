import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type routes } from "../../../back/src/routes/";

const link = new RPCLink({
  url: "http://localhost:5173/api",
});

export const orpc: RouterClient<typeof routes> = createORPCClient(link);
