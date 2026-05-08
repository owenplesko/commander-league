import { onError } from "@orpc/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { auth } from "./auth";
import { Hono } from "hono";
import { base } from "./orpc";
import { routes } from "./controllers";

const app = new Hono();

export const orpcRouter = base.router(routes);

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
    context: { headers: c.req.raw.headers },
  });
  if (matched) {
    return response;
  }

  await next();
});

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Server running at ${server.url}`);
