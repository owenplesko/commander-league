import { routes } from "./routes/";
import { os } from "@orpc/server";
import { authMiddleware } from "./auth";
import type { DB } from "./db";

export const orpcRouter = os
  .$context<{
    headers: Headers;
    env: {
      db: DB;
    };
  }>()
  .use(authMiddleware)
  .router(routes);
