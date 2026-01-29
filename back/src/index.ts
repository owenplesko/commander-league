import { onError, os } from "@orpc/server";
import { routes } from "./routes/";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { auth, authMiddleware } from "./auth";
import { Hono } from "hono";
import { type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import db from "./db";

const app = new Hono();

const orpcRouter = os
  .$context<{
    headers: Headers;
    env: {
      db: BunSQLiteDatabase;
    };
  }>()
  .use(authMiddleware)
  .router(routes);

const orpcHandler = new OpenAPIHandler(orpcRouter, {
  interceptors: [onError((error) => console.log(error))],
});

app.use("/api/auth/*", async (c, next) => {
  const res = await auth.handler(c.req.raw);
  next();
  return res;
});

app.use("/api/*", async (c, next) => {
  const { matched, response } = await orpcHandler.handle(c.req.raw, {
    prefix: "/api",
    context: { headers: c.req.raw.headers, env: { db } },
  });
  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Server running at ${server.url}`);
